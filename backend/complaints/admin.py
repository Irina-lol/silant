from django.contrib import admin
from .models import Complaint

class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('machine', 'failure_date', 'failure_node', 'recovery_date')
    list_filter = ('failure_node', 'service_company')
    search_fields = ('machine__factory_number', 'failure_description')
    date_hierarchy = 'failure_date'
    readonly_fields = ('downtime',)

admin.site.register(Complaint, ComplaintAdmin)
