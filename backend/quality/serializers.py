from rest_framework import serializers

from .models import NCR


class NCRSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    
    class Meta:
        model = NCR
        fields = ("id", "project", "project_name", "defect_type", "root_cause", "status", "created_at")

