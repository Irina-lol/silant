from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import Machine
from .serializers import MachineSerializer, PublicMachineSerializer
from .permissions import MachineAccessPermission
from .filters import MachineFilter

@api_view(['GET'])
def public_machine_search(request, factory_number):
    try:
        machine = Machine.objects.select_related('model', 'engine_model', 'transmission_model',
            'drive_axle_model', 'steering_axle_model'
        ).get(factory_number=factory_number)

        serializer = PublicMachineSerializer(machine)
        return Response(serializer.data)

    except Machine.DoesNotExist:
        return Response(
            {"error": "Машина с таким номером не найдена"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all().select_related(
        'model', 'engine_model', 'transmission_model',
        'drive_axle_model', 'steering_axle_model'
    )
    serializer_class = MachineSerializer
    filterset_class =MachineFilter
    permission_classes = [MachineAccessPermission]

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        machine = self.get_object()
        serializer = MachineDetailSerializer(machine)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Machine.objects.none()
        elif user.is_manager:
            return self.queryset
        elif user.is_client:
            return self.queryset.filter(client=user)
        elif user.is_service:
            return self.queryset.filter(service_company=user)
        return Machine.objects.none()
