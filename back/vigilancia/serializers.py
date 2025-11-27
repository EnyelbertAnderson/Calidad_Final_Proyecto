from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework_gis.fields import GeometryField
from rest_framework import serializers
from .models import Zona, Camara, Evento

class ZonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zona
        fields = ['id', 'nombre']


class CamaraSerializer(serializers.ModelSerializer):
    zona = ZonaSerializer(read_only=True)
    zona_id = serializers.IntegerField(write_only=True, required=False)
    # Ensure ubicacion is returned/accepted as GeoJSON (e.g. { type: 'Point', coordinates: [lng, lat] })
    ubicacion = GeometryField()

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
            'estado',
            'fecha_instalacion',
            'observaciones',
            'zona',
            'zona_id'
        ]


class CamaraGeoSerializer(GeoFeatureModelSerializer):
    zona = ZonaSerializer(read_only=True)
    
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
            'estado',
            'zona'
        ]


class EventoSerializer(serializers.ModelSerializer):
    camara_info = serializers.SerializerMethodField(read_only=True)
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    severidad_display = serializers.CharField(source='get_severidad_display', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    
    class Meta:
        model = Evento
        fields = [
            'id',
            'camara',
            'camara_info',
            'tipo',
            'tipo_display',
            'severidad',
            'severidad_display',
            'estado',
            'estado_display',
            'titulo',
            'descripcion',
            'fecha_registro',
            'fecha_resolucion',
            'reportado_por',
            'atendido_por',
            'notas_resolucion'
        ]
        read_only_fields = ['fecha_registro']
    
    def get_camara_info(self, obj):
        return {
            'id': obj.camara.id,
            'direccion': obj.camara.direccion,
            'zona': obj.camara.zona.nombre if obj.camara.zona else None,
            'marca': obj.camara.marca,
            'estado': obj.camara.estado
        }


class EventoCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para crear/actualizar eventos"""
    
    class Meta:
        model = Evento
        fields = [
            'id',
            'camara',
            'tipo',
            'severidad',
            'estado',
            'titulo',
            'descripcion',
            'reportado_por',
            'atendido_por',
            'notas_resolucion',
            'fecha_resolucion'
        ]


class DashboardSerializer(serializers.Serializer):
    """Serializer para estadísticas del dashboard"""
    total_camaras = serializers.IntegerField()
    camaras_operativas = serializers.IntegerField()
    camaras_inactivas = serializers.IntegerField()
    camaras_mantenimiento = serializers.IntegerField()
    porcentaje_operativas = serializers.FloatField()
    porcentaje_inactivas = serializers.FloatField()
    porcentaje_mantenimiento = serializers.FloatField()
    distribucion_por_zona = serializers.ListField()
    distribucion_por_tecnologia = serializers.ListField()
    distribucion_por_tipo = serializers.ListField()
    eventos_pendientes = serializers.IntegerField()
    eventos_criticos = serializers.IntegerField()
    