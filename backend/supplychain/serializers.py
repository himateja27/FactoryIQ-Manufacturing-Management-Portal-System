from rest_framework import serializers

from .models import InventoryItem, Shipment


class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ("id", "item_name", "quantity", "location", "updated_at")


class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ("id", "tracking_id", "status", "eta", "created_at")

