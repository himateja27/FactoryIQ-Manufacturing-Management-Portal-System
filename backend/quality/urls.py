from rest_framework.routers import DefaultRouter

from .views import NCRViewSet

router = DefaultRouter()
router.register(r"quality/ncrs", NCRViewSet, basename="ncr")

urlpatterns = router.urls

