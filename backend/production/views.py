from rest_framework import permissions, viewsets

from .models import ProductionRecord
from .serializers import ProductionRecordSerializer


class ProductionRecordViewSet(viewsets.ModelViewSet):
    serializer_class = ProductionRecordSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        qs = ProductionRecord.objects.select_related("project", "project__customer").order_by("-recorded_at")
        role = getattr(user, "role", None)
        if role == "customer":
            # Customer -> only their projects' production
            return qs.filter(project__customer=user)
        if role in ("admin", "engineer"):
            # Admin & Engineer -> all production data
            return qs
        # Other roles should not see production data
        return qs.none()

from django.shortcuts import render

# Create your views here.
