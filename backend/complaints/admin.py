from django.contrib import admin
from .models import Complaint

class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('machine', 'failure_date', 'failure_node', 'recovery_date', 'downtime')
    list_filter = ('failure_node', 'service_company')
    search_fields = ('machine__factory_number', 'failure_description')
    date_hierarchy = 'failure_date'
    readonly_fields = ('downtime',)
    
    def save_model(self, request, obj, form, change):
        if obj.recovery_date and obj.failure_date:
            obj.downtime = (obj.recovery_date - obj.failure_date).days
        super().save_model(request, obj, form, change)

admin.site.register(Complaint, ComplaintAdmin)
