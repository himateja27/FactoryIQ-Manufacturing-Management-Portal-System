from rest_framework import permissions, viewsets

from .models import InventoryItem, Shipment
from .serializers import InventoryItemSerializer, ShipmentSerializer


class InventoryPermissions(permissions.BasePermission):
    """
    Inventory / Shipments permissions:
    - Admin, Engineer: full CRUD
    - Quality, Customer, others: read-only
    """

    def has_permission(self, request, view):
        role = getattr(request.user, "role", None)
        if request.method in permissions.SAFE_METHODS:
            return True
        # write operations
        return role in ("admin", "engineer")


class InventoryItemViewSet(viewsets.ModelViewSet):
    serializer_class = InventoryItemSerializer
    permission_classes = (permissions.IsAuthenticated, InventoryPermissions)
    queryset = InventoryItem.objects.order_by("item_name")


class ShipmentViewSet(viewsets.ModelViewSet):
    serializer_class = ShipmentSerializer
    permission_classes = (permissions.IsAuthenticated, InventoryPermissions)
    queryset = Shipment.objects.order_by("-created_at")

from django.shortcuts import render

# Create your views here.
