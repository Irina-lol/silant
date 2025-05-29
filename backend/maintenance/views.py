from rest_framework import viewsets
from .models import Maintenance
from .serializers import MaintenanceSerializer
from .permissions import MaintenanceAccessPermission
from .filters import MaintenanceFilter

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all().select_related(
        'type', 'machine', 'service_company'
    )
    serializer_class = MaintenanceSerializer
    filterset_class = MaintenanceFilter
    permission_classes = [MaintenanceAccessPermission]
    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Maintenance.objects.none()
        elif user.is_manager:
            return self.queryset
        return self.queryset.filter(
            machine__service_company=user) | self.queryset.filter(
            machine__client=user
            )
