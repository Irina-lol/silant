import django_filters
from .models import Maintenance

class MaintenanceFilter(django_filters.FilterSet):
    type = django_filters.CharFilter(field_name='type__title')
    machine = django_filters.CharFilter(field_name='machine__factory_number')
    service_company = django_filters.CharFilter(field_name='service_company__company_name')

    class Meta:
        model = Maintenance
        fields = ['type', 'machine', 'service_company']