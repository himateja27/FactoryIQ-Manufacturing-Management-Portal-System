from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Project, Document, ProjectApproval
from .serializers import ProjectSerializer, DocumentSerializer, ProjectApprovalSerializer
from .notifications import NotificationService


class IsAdminOrEngineer(permissions.BasePermission):
    """Only admin and engineer can approve projects"""
    def has_permission(self, request, view):
        role = getattr(request.user, "role", None)
        return role in ["admin", "engineer"]


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'approval_status', 'customer']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) == "customer":
            return Project.objects.filter(customer=user).order_by("-created_at")
        return Project.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, "role", None) == "customer":
            serializer.save(customer=user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrEngineer])
    def submit_for_approval(self, request, pk=None):
        """Submit project for approval"""
        project = self.get_object()
        
        if project.approval_status != Project.ApprovalStatus.PENDING:
            return Response(
                {"error": "Project can only be submitted from pending state"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        project.approval_status = Project.ApprovalStatus.PENDING
        project.save()
        
        # Create approval record
        ProjectApproval.objects.create(
            project=project,
            action=ProjectApproval.Action.SUBMITTED,
            approver=request.user,
            notes="Project submitted for approval"
        )
        
        # Send email notification to approvers
        approvers = Project.objects.none()
        NotificationService.send_approval_submitted(project, approvers)
        
        return Response({"status": "submitted for approval"})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrEngineer])
    def approve(self, request, pk=None):
        """Approve a project"""
        project = self.get_object()
        notes = request.data.get("notes", "")
        
        project.approval_status = Project.ApprovalStatus.APPROVED
        project.approved_by = request.user
        project.approved_at = timezone.now()
        project.approval_notes = notes
        project.save()
        
        # Create approval record
        ProjectApproval.objects.create(
            project=project,
            action=ProjectApproval.Action.APPROVED,
            approver=request.user,
            notes=notes
        )
        
        # Send email notification
        NotificationService.send_approval_status(project, "approved", request.user)
        
        return Response({"status": "approved"})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrEngineer])
    def reject(self, request, pk=None):
        """Reject a project"""
        project = self.get_object()
        notes = request.data.get("notes", "")
        
        project.approval_status = Project.ApprovalStatus.REJECTED
        project.approval_notes = notes
        project.save()
        
        # Create approval record
        ProjectApproval.objects.create(
            project=project,
            action=ProjectApproval.Action.REJECTED,
            approver=request.user,
            notes=notes
        )
        
        # Send email notification
        NotificationService.send_approval_status(project, "rejected", request.user)
        
        return Response({"status": "rejected"})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrEngineer])
    def request_revision(self, request, pk=None):
        """Request changes to project"""
        project = self.get_object()
        notes = request.data.get("notes", "")
        
        project.approval_status = Project.ApprovalStatus.PENDING
        project.approval_notes = notes
        project.save()
        
        # Create approval record
        ProjectApproval.objects.create(
            project=project,
            action=ProjectApproval.Action.REVISED,
            approver=request.user,
            notes=notes
        )
        
        # Send email notification
        NotificationService.send_approval_status(project, "revised", request.user)
        
        return Response({"status": "revision requested"})


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['project', 'document_type']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'version']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) == "customer":
            return Document.objects.filter(project__customer=user).order_by("-created_at")
        return Document.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        document = serializer.save(uploaded_by=self.request.user)
        # Send email notification
        NotificationService.send_document_uploaded(document, document.project)


class ProjectApprovalViewSet(viewsets.ReadOnlyModelViewSet):
    """View-only endpoint for approval history"""
    serializer_class = ProjectApprovalSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['project', 'action']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) == "customer":
            return ProjectApproval.objects.filter(project__customer=user)
        return ProjectApproval.objects.all()
