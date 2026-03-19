from django.db import models


class InventoryItem(models.Model):
    item_name = models.CharField(max_length=255)
    quantity = models.IntegerField(default=0)
    location = models.CharField(max_length=255, blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.item_name} ({self.quantity})"


class Shipment(models.Model):
    tracking_id = models.CharField(max_length=120, unique=True)
    status = models.CharField(max_length=120, default="pending")
    eta = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.tracking_id
