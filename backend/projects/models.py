from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError


class Project(models.Model):
    class Status(models.TextChoices):
        RND = "rnd", "R&D"
        APPROVAL = "approval", "Approval"
        PRODUCTION = "production", "Production"
        SHIPMENT = "shipment", "Shipment"
        CLOSED = "closed", "Closed"

    class ApprovalStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.RND)
    approval_status = models.CharField(
        max_length=20, 
        choices=ApprovalStatus.choices, 
        default=ApprovalStatus.PENDING,
        help_text="Approval workflow status"
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    approval_notes = models.TextField(blank=True, default="")

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="customer_projects",
        null=True,
        blank=True,
        help_text="Owning customer for RBAC filtering.",
    )
    
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_projects",
        help_text="User who approved this project"
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.status})"


class Document(models.Model):
    class DocType(models.TextChoices):
        BOM = "bom", "Bill of Materials"
        REPORT = "report", "Report"
        SPECIFICATION = "specification", "Specification"
        OTHER = "other", "Other"

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="documents"
    )
    title = models.CharField(max_length=255)
    document_type = models.CharField(max_length=50, choices=DocType.choices, default=DocType.OTHER)
    file = models.FileField(upload_to="documents/%Y/%m/%d/")
    description = models.TextField(blank=True, default="")
    version = models.PositiveIntegerField(default=1)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="uploaded_documents"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.title} (v{self.version})"


class ProjectApproval(models.Model):
    class Action(models.TextChoices):
        SUBMITTED = "submitted", "Submitted for approval"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        REVISED = "revised", "Changes requested (revision)"

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="approvals"
    )
    action = models.CharField(max_length=20, choices=Action.choices)
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="project_approvals"
    )
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.project.name} - {self.action}"

