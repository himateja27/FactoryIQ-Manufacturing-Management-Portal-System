from django.db import models

from projects.models import Project


class ProductionRecord(models.Model):
    class Shift(models.TextChoices):
        DAY = "day", "Day"
        NIGHT = "night", "Night"

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="production_records")
    output = models.PositiveIntegerField(default=0)
    defects = models.PositiveIntegerField(default=0)
    shift = models.CharField(max_length=10, choices=Shift.choices, default=Shift.DAY)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.project_id} {self.shift} out={self.output} def={self.defects}"
