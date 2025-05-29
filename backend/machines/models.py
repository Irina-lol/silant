from django.db import models
from users.models import User

class Handbook(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ('name', 'title')

    def __str__(self):
        return f"{self.name}: {self.title}"

class Machine(models.Model):
    factory_number = models.CharField(max_length=100, unique=True)
    model = models.ForeignKey(
        Handbook,
        on_delete=models.PROTECT,
        limit_choices_to={'name': 'Модель техники'},
        related_name='machine_models'
    )
    engine_model = models.ForeignKey(
        Handbook,
        on_delete=models.PROTECT,
        limit_choices_to={'name': 'Модель двигателя'},
        related_name='machine_engines'
    )
    engine_number = models.CharField(max_length=100)
    transmission_model = models.ForeignKey(
        Handbook,
        on_delete=models.PROTECT,
        limit_choices_to={'name': 'Модель трансмиссии'},
        related_name='transmission_machines'
    )
    transmission_number = models.CharField(max_length=100)
    drive_axle_model = models.ForeignKey(
        Handbook,
        on_delete=models.PROTECT,
        related_name='drive_axle_machines'
    )
    drive_axle_number = models.CharField(max_length=100)
    steering_axle_model = models.ForeignKey(
        Handbook,
        on_delete=models.CASCADE,
        related_name='steering_axle_machines'
    )
    steering_axle_number = models.CharField(max_length=100)
    supply_contract = models.CharField(max_length=100, blank=True)
    shipping_date = models.DateField()
    consignee = models.CharField(max_length=100)
    delivery_address = models.TextField()
    equipment = models.TextField(blank=True)
    client = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='client_owned_machines',
        limit_choices_to={'role': 'CL'}
    )
    service_company = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='service_maintained_machines',
        limit_choices_to={'role': 'SO'}
    )
    class Meta:
        ordering = ['-shipping_date']
        verbose_name = 'Машина'
        verbose_name_plural = 'Машины'

    def __str__(self):
        return f"{self.model.title} (№{self.factory_number})"