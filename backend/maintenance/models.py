from django.db import models
from machines.models import Handbook, Machine
from users.models import User

class Maintenance(models.Model):
    type = models.ForeignKey(
        Handbook,
        on_delete=models.PROTECT,
        limit_choices_to={'name': 'Вид ТО'},
        related_name='maintenance_records'
    )
    date = models.DateField()
    operating_hours = models.PositiveIntegerField()
    order_number = models.CharField(max_length=100)
    order_date = models.DateField()
    service_company = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'SO'},
        related_name='performed_maintenances'
    )
    machine = models.ForeignKey(
        Machine,
        on_delete=models.CASCADE,
        related_name='maintenance_history'
    )
    class Meta:
        ordering = ['-date']
        verbose_name = 'Техническое обслуживание'
        verbose_name_plural = 'Технические обслуживания'

    def __str__(self):
        return f"ТО {self.type} для {self.machine}"
