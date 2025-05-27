from django.contrib import admin
from machines.models import Handbook, Machine


class HandbookAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'description')
    list_filter = ('name',)
    search_fields = ('title', 'description')

class MachineAdmin(admin.ModelAdmin):
    list_display = ('factory_number', 'model', 'client', 'service_company')
    list_filter = ('model', 'client', 'service_company')
    search_fields = ('factory_number', 'engine_number')
    raw_id_fields = ('client', 'service_company')

admin.site.register(Handbook, HandbookAdmin)
admin.site.register(Machine, MachineAdmin)
