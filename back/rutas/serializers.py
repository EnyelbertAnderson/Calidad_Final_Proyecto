from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Ruta
from vigilancia.serializers import CamaraSerializer  # si ya tienes uno
from vigilancia.models import Camara

class RutaSerializer(GeoFeatureModelSerializer):
    # Para incluir/mostrar cámaras (IDs) en las operaciones create/update
    camaras = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Camara.objects.all(), required=False
    )

    class Meta:
        model = Ruta
        geo_field = "linea"              # campo geométrico
        fields = ("id", "nombre", "descripcion", "fecha_creacion", "linea", "camaras")
