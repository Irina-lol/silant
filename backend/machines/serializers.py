from rest_framework import serializers
from .models import Machine, Handbook
from users.models import User

class HandbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handbook
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'company_name', 'role']

class MachineSerializer(serializers.ModelSerializer):
    model = serializers.PrimaryKeyRelatedField(queryset=Handbook.objects.all())
    engine_model = serializers.PrimaryKeyRelatedField(queryset=Handbook.objects.all())
    transmission_model = serializers.PrimaryKeyRelatedField(queryset=Handbook.objects.all())
    drive_axle_model = serializers.PrimaryKeyRelatedField(queryset=Handbook.objects.all())
    steering_axle_model = serializers.PrimaryKeyRelatedField(queryset=Handbook.objects.all())
    client = UserSerializer()
    service_company = UserSerializer()

    class Meta:
        model = Machine
        fields = '__all__'

class PublicMachineSerializer(serializers.ModelSerializer):
    model = serializers.StringRelatedField()
    engine_model = serializers.StringRelatedField()
    transmission_model = serializers.StringRelatedField()
    drive_axle_model = serializers.StringRelatedField()
    steering_axle_model = serializers.StringRelatedField()

    class Meta:
        model = Machine
        fields = [
            'factory_number', 'model', 'engine_model',
            'engine_number', 'transmission_model',
            'transmission_number', 'drive_axle_model',
            'drive_axle_number', 'steering_axle_model',
            'steering_axle_number'
        ]