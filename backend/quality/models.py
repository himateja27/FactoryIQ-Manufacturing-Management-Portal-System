from django.db import models

from projects.models import Project


class NCR(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        INVESTIGATING = "investigating", "Investigating"
        CLOSED = "closed", "Closed"

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="ncrs")
    defect_type = models.CharField(max_length=255)
    root_cause = models.TextField(blank=True, default="")
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"NCR {self.id} ({self.status})"
