from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        ENGINEER = "engineer", "Engineer"
        QUALITY = "quality", "Quality"
        CUSTOMER = "customer", "Customer"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)

    def __str__(self) -> str:
        label = self.get_full_name() or self.username
        return f"{label} ({self.role})"
