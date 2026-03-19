from django.contrib import admin

from .models import ProductionRecord


@admin.register(ProductionRecord)
class ProductionRecordAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "shift", "output", "defects", "recorded_at")
    list_filter = ("shift", "recorded_at")
    search_fields = ("project__name",)
