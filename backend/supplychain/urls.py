from rest_framework.routers import DefaultRouter

from .views import InventoryItemViewSet, ShipmentViewSet

router = DefaultRouter()
router.register(r"supplychain/inventory", InventoryItemViewSet, basename="inventory")
router.register(r"supplychain/shipments", ShipmentViewSet, basename="shipment")

urlpatterns = router.urls

