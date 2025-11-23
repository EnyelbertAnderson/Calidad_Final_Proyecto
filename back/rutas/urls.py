from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RutaViewSet

router = DefaultRouter()
router.register(r"rutas", RutaViewSet, basename="ruta")

urlpatterns = [
    path("", include(router.urls)),
]
