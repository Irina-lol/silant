from django.contrib import admin
from .models import Maintenance

class MaintenanceAdmin(admin.ModelAdmin):
    list_display = ('machine', 'type', 'date', 'service_company')
    list_filter = ('type', 'service_company')
    search_fields = ('machine__factory_number', 'order_number')
    date_hierarchy = 'date'

admin.site.register(Maintenance, MaintenanceAdmin)
