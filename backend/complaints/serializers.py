from rest_framework import serializers
from .models import Complaint
from machines.models import Machine, Handbook

class ComplaintSerializer(serializers.ModelSerializer):
    failure_node = serializers.PrimaryKeyRelatedField(queryset=Handbook.objects.filter(name='Узел отказа'))
    recovery_method = serializers.PrimaryKeyRelatedField(queryset=Handbook.objects.filter(name='Способ восстановления'))
    machine = serializers.PrimaryKeyRelatedField(queryset=Machine.objects.all())
    service_company = serializers.StringRelatedField()

    class Meta:
        model = Complaint
        fields = '__all__'