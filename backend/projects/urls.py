from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, DocumentViewSet, ProjectApprovalViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"documents", DocumentViewSet, basename="document")
router.register(r"project-approvals", ProjectApprovalViewSet, basename="project-approval")

urlpatterns = router.urls

