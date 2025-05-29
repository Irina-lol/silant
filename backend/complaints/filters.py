import django_filters
from .models import Complaint

class ComplaintFilter(django_filters.FilterSet):
    failure_node = django_filters.CharFilter(field_name='failure_node__title')
    recovery_method = django_filters.CharFilter(field_name='recovery_method__title')
    service_company = django_filters.CharFilter(field_name='service_company__company_name')

    class Meta:
        model = Complaint
        fields = ['failure_node', 'recovery_method', 'service_company']