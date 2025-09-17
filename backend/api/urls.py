from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_overview, name='api-overview'),
    path('hello/', views.hello_world, name='hello'),
    path('health/', views.health_check, name='health-check'),
]