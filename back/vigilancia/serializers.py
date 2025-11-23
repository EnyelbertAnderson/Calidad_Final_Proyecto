from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from .models import Zona, Camara

class ZonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zona
        fields = ['id', 'nombre']

class CamaraSerializer(serializers.ModelSerializer):
    zona = ZonaSerializer(read_only=True)

    class Meta:
        model = Camara
        fields = [
            'id',
            'direccion',
            'tecnologia',
            'tipo',
            'marca',
            'ubicacion',
            'administrador',
            'zona'
        ]

class CamaraGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Camara
        geo_field = 'ubicacion'
        fields = [
            'id',
            'direccion',
            'tecnologia',
            'tipo',
            'marca',
            'administrador',
            'zona'
        ]