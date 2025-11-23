from django.urls import path
from .views import ZonaList, CamaraList, CamaraGeo

urlpatterns = [
    path('zonas/', ZonaList.as_view(), name='zonas'),
    path('camaras/', CamaraList.as_view(), name='camaras'),
    path('camaras/geo/', CamaraGeo.as_view(), name='camaras_geo'),
]
