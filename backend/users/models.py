from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLES = (
        ('CL', 'Клиент'),
        ('SO', 'Сервисная организация'),
        ('MN', 'Менеджер'),
    )

    role = models.CharField(max_length=2, choices=ROLES)
    company_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)

    @property
    def is_client(self):
        return self.role == 'CL'

    @property
    def is_service(self):
        return self.role == 'SO'

    @property
    def is_manager(self):
        return self.role == 'MN'

    def __str__(self):
        return f"{self.get_role_display()}: {self.username}"
