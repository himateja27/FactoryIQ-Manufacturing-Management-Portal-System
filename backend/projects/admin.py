from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "status", "customer", "start_date", "end_date", "created_at")
    list_filter = ("status",)
    search_fields = ("name", "customer__username", "customer__email")
