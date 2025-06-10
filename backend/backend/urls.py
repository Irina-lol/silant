"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.routers import DefaultRouter
from machines.views import MachineViewSet, public_machine_search
from maintenance.views import MaintenanceViewSet
from complaints.views import ComplaintViewSet
from users.views import CustomAuthToken

router = DefaultRouter()
router.register(r'machine', MachineViewSet)
router.register(r'maintenance', MaintenanceViewSet)
router.register(r'complaint', ComplaintViewSet)

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/csrf_token/', get_csrf_token, name='csrf_token'),
    path('api/auth/login/', CustomAuthToken.as_view(), name='api-login'),
    path('api/auth/', include('rest_framework.urls')),
    path('api/public/machines/<str:factory_number>/', public_machine_search),
    path('accounts/', include('allauth.urls')),
]
