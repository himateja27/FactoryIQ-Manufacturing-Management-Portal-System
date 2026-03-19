from rest_framework import serializers

from .models import ProductionRecord


class ProductionRecordSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    
    class Meta:
        model = ProductionRecord
        fields = ("id", "project", "project_name", "output", "defects", "shift", "recorded_at")

