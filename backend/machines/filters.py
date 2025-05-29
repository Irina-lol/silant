import django_filters
from .models import Machine

class MachineFilter(django_filters.FilterSet):
    model = django_filters.CharFilter(field_name='model__title')
    engine_model = django_filters.CharFilter(field_name='engine_model__title')
    transmission_model = django_filters.CharFilter(field_name='transmission_model__title')
    drive_axle_model = django_filters.CharFilter(field_name='drive_axle_model__title')
    steering_axle_model = django_filters.CharFilter(field_name='steering_axle_model__title')

    class Meta:
        model = Machine
        fields = [
            'model', 'engine_model', 'transmission_model',
            'drive_axle_model', 'steering_axle_model',
        ]