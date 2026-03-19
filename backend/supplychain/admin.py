from django.contrib import admin

from .models import InventoryItem, Shipment


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ("id", "item_name", "quantity", "location", "updated_at")
    search_fields = ("item_name", "location")


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ("id", "tracking_id", "status", "eta", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("tracking_id",)
