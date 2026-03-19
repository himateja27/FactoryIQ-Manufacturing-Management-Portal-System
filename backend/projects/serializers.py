from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Project, Document, ProjectApproval

User = get_user_model()


class ProjectSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(source="customer.username", read_only=True)
    approved_by_username = serializers.CharField(source="approved_by.username", read_only=True)

    class Meta:
        model = Project
        fields = (
            "id",
            "name",
            "description",
            "status",
            "approval_status",
            "start_date",
            "end_date",
            "customer",
            "customer_username",
            "approval_notes",
            "approved_by",
            "approved_by_username",
            "approved_at",
            "created_at",
            "updated_at",
        )
        extra_kwargs = {
            "customer": {"required": False},
            "approved_by": {"read_only": True},
            "approved_at": {"read_only": True},
            "approval_status": {"read_only": True},
        }


class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.CharField(source="uploaded_by.username", read_only=True)
    project_name = serializers.CharField(source="project.name", read_only=True)

    class Meta:
        model = Document
        fields = (
            "id",
            "project",
            "project_name",
            "title",
            "document_type",
            "file",
            "description",
            "version",
            "uploaded_by",
            "uploaded_by_username",
            "created_at",
            "updated_at",
        )
        extra_kwargs = {
            "uploaded_by": {"read_only": True},
        }


class ProjectApprovalSerializer(serializers.ModelSerializer):
    approver_username = serializers.CharField(source="approver.username", read_only=True)
    project_name = serializers.CharField(source="project.name", read_only=True)

    class Meta:
        model = ProjectApproval
        fields = (
            "id",
            "project",
            "project_name",
            "action",
            "approver",
            "approver_username",
            "notes",
            "created_at",
        )
        extra_kwargs = {
            "approver": {"read_only": True},
        }

