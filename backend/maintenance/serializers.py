from rest_framework import serializers
from .models import Maintenance
from machines.models import Machine, Handbook


class MaintenanceSerializer(serializers.ModelSerializer):
    type = serializers.PrimaryKeyRelatedField(queryset=Handbook.objects.filter(name='Вид ТО'))
    machine = serializers.PrimaryKeyRelatedField(queryset=Machine.objects.all())
    service_company = serializers.StringRelatedField()

    class Meta:
        model = Maintenance
        fields = '__all__'