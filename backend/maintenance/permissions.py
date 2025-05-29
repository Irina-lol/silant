from rest_framework import permissions

class MaintenanceAccessPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_manager:
            return True
        return obj.machine.service_company == request.user or obj.machine.client == request.user