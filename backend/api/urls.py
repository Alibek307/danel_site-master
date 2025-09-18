from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet)

urlpatterns = [
    path('', views.api_overview, name='api-overview'),
    path('hello/', views.hello_world, name='hello'),
    path('health/', views.health_check, name='health-check'),
    path('', include(router.urls)),
]