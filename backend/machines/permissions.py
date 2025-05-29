from rest_framework import permissions

class MachineAccessPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_manager:
            return True
        elif request.user.is_client:
            return obj.client == request.user
        elif request.user.is_service:
            return obj.service_company == request.user
        return False