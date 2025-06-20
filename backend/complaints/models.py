from django.db import models
from machines.models import Handbook, Machine
from users.models import User
from django.core.exceptions import ValidationError


class Complaint(models.Model):
    failure_date = models.DateField()
    operating_hours = models.PositiveIntegerField()
    failure_node = models.ForeignKey(
        Handbook,
        on_delete=models.PROTECT,
        limit_choices_to={'name': 'Узел отказа'},
        related_name='failure_complaints'
    )
    failure_description = models.TextField()
    recovery_method = models.ForeignKey(
        Handbook,
        on_delete=models.PROTECT,
        limit_choices_to={'name': 'Способ восстановления'},
        related_name='recovery_complaints'
    )
    spare_parts = models.TextField(blank=True)
    recovery_date = models.DateField()
    downtime = models.PositiveIntegerField(editable=False)
    machine = models.ForeignKey(
        Machine,
        on_delete=models.CASCADE,
        related_name='machine_complaints'
    )
    service_company = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'SO'},
        related_name='handled_complaints'
    )
    class Meta:
        ordering = ['-failure_date']
        verbose_name = 'Рекламация'
        verbose_name_plural = 'Рекламации'

    def clean(self):
        if self.recovery_date and self.failure_date and self.recovery_date < self.failure_date:
            raise ValidationError("Дата восстановления не может быть раньше даты отказа!")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Рекламация {self.machine} ({self.failure_date})"