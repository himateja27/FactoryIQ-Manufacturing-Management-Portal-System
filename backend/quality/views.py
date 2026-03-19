from rest_framework import permissions, viewsets

from .models import NCR
from .serializers import NCRSerializer


class NCRViewSet(viewsets.ModelViewSet):
    serializer_class = NCRSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        qs = NCR.objects.select_related("project", "project__customer").order_by("-created_at")
        role = getattr(user, "role", None)
        if role == "customer":
            # Customer -> only NCRs on their projects
            return qs.filter(project__customer=user)
        if role in ("admin", "quality"):
            # Admin & Quality -> all QA reports
            return qs
        # Other roles should not see QA reports
        return qs.none()

from django.shortcuts import render

# Create your views here.
