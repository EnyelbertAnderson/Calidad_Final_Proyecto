from django.urls import path
from .views import (
    ZonaList,
    CamaraList,
    CamaraDetail,
    CamaraGeo,
    EventoList,
    EventoDetail,
    DashboardStats,
    DashboardEventosRecientes
)

urlpatterns = [
    # Zonas
    path('zonas/', ZonaList.as_view(), name='zona-list'),
    
    # Cámaras
    path('camaras/', CamaraList.as_view(), name='camara-list'),
    path('camaras/<int:pk>/', CamaraDetail.as_view(), name='camara-detail'),
    path('camaras/geo/', CamaraGeo.as_view(), name='camara-geo'),
    
    # Eventos
    path('eventos/', EventoList.as_view(), name='evento-list'),
    path('eventos/<int:pk>/', EventoDetail.as_view(), name='evento-detail'),
    
    # Dashboard
    path('dashboard/stats/', DashboardStats.as_view(), name='dashboard-stats'),
    path('dashboard/eventos-recientes/', DashboardEventosRecientes.as_view(), name='dashboard-eventos-recientes'),
]