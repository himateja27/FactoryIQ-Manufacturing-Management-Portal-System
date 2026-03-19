from django.contrib import admin

from .models import NCR


@admin.register(NCR)
class NCRAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "defect_type", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("project__name", "defect_type")
