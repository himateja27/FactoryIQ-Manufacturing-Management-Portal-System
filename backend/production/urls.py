from rest_framework.routers import DefaultRouter

from .views import ProductionRecordViewSet

router = DefaultRouter()
router.register(r"production", ProductionRecordViewSet, basename="production")

urlpatterns = router.urls

