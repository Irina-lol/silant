from rest_framework import viewsets
from .models import Complaint
from .serializers import ComplaintSerializer
from .filters import ComplaintFilter
from .permissions import ComplaintAccessPermission

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all().select_related(
        'failure_node', 'recovery_method',
        'machine', 'service_company'
    )
    serializer_class = ComplaintSerializer
    filterset_class = ComplaintFilter
    permission_classes = [ComplaintAccessPermission]

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Complaint.objects.none()
        elif user.is_manager:
            return self.queryset
        return self.queryset.filter(
            service_company=user) | self.queryset.filter(
            machine__client=user)