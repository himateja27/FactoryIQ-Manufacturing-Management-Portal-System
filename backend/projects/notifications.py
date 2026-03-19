import os
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


class NotificationService:
    """Service for sending email notifications"""

    @staticmethod
    def send_approval_submitted(project, approvers_list):
        """Send notification when project submitted for approval"""
        subject = f"Project approval required: {project.name}"
        
        context = {
            "project": project,
            "project_url": f"{settings.FRONTEND_URL}/projects/{project.id}",
        }
        
        for approver in approvers_list:
            context["approver_name"] = approver.get_full_name() or approver.username
            
            html_message = f"""
            <h2>Project Approval Required</h2>
            <p>Hi {context['approver_name']},</p>
            <p>Project <strong>{project.name}</strong> has been submitted for your approval.</p>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Customer:</strong> {project.customer.username}</p>
            <p><a href="{context['project_url']}">Review Project</a></p>
            <p>Thank you!</p>
            """
            
            send_mail(
                subject,
                strip_tags(html_message),
                settings.DEFAULT_FROM_EMAIL,
                [approver.email],
                html_message=html_message,
                fail_silently=True,
            )

    @staticmethod
    def send_approval_status(project, status, approver):
        """Send notification when project approval status changes"""
        if not project.customer or not project.customer.email:
            return  # Skip if no customer
            
        subject = f"Project {status}: {project.name}"
        
        status_text = {
            "approved": "✅ Approved",
            "rejected": "❌ Rejected",
            "revised": "🔄 Changes Requested"
        }.get(status, status.capitalize())
        
        html_message = f"""
        <h2>Project Approval {status_text}</h2>
        <p>Hi {project.customer.get_full_name() or project.customer.username},</p>
        <p>Your project <strong>{project.name}</strong> has been <strong>{status}</strong>.</p>
        <p><strong>Approved by:</strong> {approver.get_full_name() or approver.username}</p>
        <p><strong>Notes:</strong> {project.approval_notes or 'None'}</p>
        <p>Thank you!</p>
        """
        
        send_mail(
            subject,
            strip_tags(html_message),
            settings.DEFAULT_FROM_EMAIL,
            [project.customer.email],
            html_message=html_message,
            fail_silently=True,
        )

    @staticmethod
    def send_document_uploaded(document, project):
        """Send notification when document uploaded"""
        if not project or not project.customer or not project.customer.email:
            return  # Skip if no customer
            
        subject = f"Document uploaded: {document.title}"
        
        doc_type_map = {
            "bom": "Bill of Materials",
            "report": "Report",
            "specification": "Specification",
            "other": "Other"
        }
        doc_type = doc_type_map.get(document.document_type, document.document_type)
        
        html_message = f"""
        <h2>New Document Uploaded</h2>
        <p>New document has been uploaded to project <strong>{project.name}</strong>.</p>
        <p><strong>Title:</strong> {document.title}</p>
        <p><strong>Type:</strong> {doc_type}</p>
        <p><strong>Uploaded by:</strong> {document.uploaded_by.get_full_name() or document.uploaded_by.username}</p>
        <p>Thank you!</p>
        """
        
        # Send to customer only
        send_mail(
            subject,
            strip_tags(html_message),
            settings.DEFAULT_FROM_EMAIL,
            [project.customer.email],
            html_message=html_message,
            fail_silently=True,
        )
