from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.gis.geos import Point
from django.db.models import Q, Count
from django.utils import timezone

from login.views import jwt_required
from .models import Camara, Zona, Evento
from .serializers import (
    ZonaSerializer,
    CamaraSerializer,
    CamaraGeoSerializer,
    EventoSerializer,
    EventoCreateUpdateSerializer,
    DashboardSerializer
)


class ZonaList(APIView):
    @jwt_required
    def get(self, request):
        zonas = Zona.objects.all()
        serializer = ZonaSerializer(zonas, many=True)
        return Response(serializer.data)


class CamaraList(APIView):
    @jwt_required
    def get(self, request):
        qs = Camara.objects.all()

        tecnologia = request.GET.get("tecnologia")
        tipo = request.GET.get("tipo")
        marca = request.GET.get("marca")
        zona = request.GET.get("zona")
        estado = request.GET.get("estado")
        search = request.GET.get("search")

        if tecnologia:
            qs = qs.filter(tecnologia__icontains=tecnologia)

        if tipo:
            qs = qs.filter(tipo__icontains=tipo)

        if marca:
            qs = qs.filter(marca__icontains=marca)

        if zona:
            qs = qs.filter(zona__nombre__icontains=zona)
        
        if estado:
            qs = qs.filter(estado=estado)
        
        if search:
            qs = qs.filter(
                Q(direccion__icontains=search) |
                Q(marca__icontains=search) |
                Q(administrador__icontains=search)
            )

        serializer = CamaraSerializer(qs, many=True)
        return Response(serializer.data)
    
    @jwt_required
    def post(self, request):
        serializer = CamaraSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CamaraDetail(APIView):
    @jwt_required
    def get(self, request, pk):
        try:
            camara = Camara.objects.get(pk=pk)
            serializer = CamaraSerializer(camara)
            return Response(serializer.data)
        except Camara.DoesNotExist:
            return Response(
                {"error": "Cámara no encontrada"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @jwt_required
    def put(self, request, pk):
        try:
            camara = Camara.objects.get(pk=pk)
            serializer = CamaraSerializer(camara, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Camara.DoesNotExist:
            return Response(
                {"error": "Cámara no encontrada"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @jwt_required
    def delete(self, request, pk):
        try:
            camara = Camara.objects.get(pk=pk)
            camara.delete()
            return Response(
                {"message": "Cámara eliminada correctamente"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Camara.DoesNotExist:
            return Response(
                {"error": "Cámara no encontrada"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class CamaraGeo(APIView):
    @jwt_required
    def get(self, request):
        qs = Camara.objects.all()

        tecnologia = request.GET.get("tecnologia")
        tipo = request.GET.get("tipo")
        marca = request.GET.get("marca")
        zona = request.GET.get("zona")
        estado = request.GET.get("estado")

        if tecnologia:
            qs = qs.filter(tecnologia__icontains=tecnologia)

        if tipo:
            qs = qs.filter(tipo__icontains=tipo)

        if marca:
            qs = qs.filter(marca__icontains=marca)

        if zona:
            qs = qs.filter(zona__nombre__icontains=zona)
        
        if estado:
            qs = qs.filter(estado=estado)

        serializer = CamaraGeoSerializer(qs, many=True)
        return Response(serializer.data)


class EventoList(APIView):
    @jwt_required
    def get(self, request):
        qs = Evento.objects.select_related('camara', 'camara__zona').all()
        
        # Filtros
        camara_id = request.GET.get("camara")
        tipo = request.GET.get("tipo")
        severidad = request.GET.get("severidad")
        estado = request.GET.get("estado")
        fecha_desde = request.GET.get("fecha_desde")
        fecha_hasta = request.GET.get("fecha_hasta")
        
        if camara_id:
            qs = qs.filter(camara_id=camara_id)
        
        if tipo:
            qs = qs.filter(tipo=tipo)
        
        if severidad:
            qs = qs.filter(severidad=severidad)
        
        if estado:
            qs = qs.filter(estado=estado)
        
        if fecha_desde:
            qs = qs.filter(fecha_registro__gte=fecha_desde)
        
        if fecha_hasta:
            qs = qs.filter(fecha_registro__lte=fecha_hasta)
        
        serializer = EventoSerializer(qs, many=True)
        return Response(serializer.data)
    
    @jwt_required
    def post(self, request):
        serializer = EventoCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            evento = serializer.save()
            # Retornar con el serializer completo
            response_serializer = EventoSerializer(evento)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventoDetail(APIView):
    @jwt_required
    def get(self, request, pk):
        try:
            evento = Evento.objects.select_related('camara', 'camara__zona').get(pk=pk)
            serializer = EventoSerializer(evento)
            return Response(serializer.data)
        except Evento.DoesNotExist:
            return Response(
                {"error": "Evento no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @jwt_required
    def put(self, request, pk):
        try:
            evento = Evento.objects.get(pk=pk)
            serializer = EventoCreateUpdateSerializer(
                evento, 
                data=request.data, 
                partial=True
            )
            if serializer.is_valid():
                evento = serializer.save()
                response_serializer = EventoSerializer(evento)
                return Response(response_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Evento.DoesNotExist:
            return Response(
                {"error": "Evento no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @jwt_required
    def delete(self, request, pk):
        try:
            evento = Evento.objects.get(pk=pk)
            evento.delete()
            return Response(
                {"message": "Evento eliminado correctamente"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Evento.DoesNotExist:
            return Response(
                {"error": "Evento no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class DashboardStats(APIView):
    """
    Vista para obtener estadísticas del dashboard
    Cumple con requisitos EDU-0010 y EDU-0011
    """
    @jwt_required
    def get(self, request):
        # Estadísticas de cámaras
        total_camaras = Camara.objects.count()
        camaras_operativas = Camara.objects.filter(estado='operativa').count()
        camaras_inactivas = Camara.objects.filter(estado='inactiva').count()
        camaras_mantenimiento = Camara.objects.filter(estado='mantenimiento').count()
        
        # Porcentajes
        if total_camaras > 0:
            porcentaje_operativas = round((camaras_operativas / total_camaras) * 100, 2)
            porcentaje_inactivas = round((camaras_inactivas / total_camaras) * 100, 2)
            porcentaje_mantenimiento = round((camaras_mantenimiento / total_camaras) * 100, 2)
        else:
            porcentaje_operativas = porcentaje_inactivas = porcentaje_mantenimiento = 0
        
        # Distribución por zona
        distribucion_zona = list(
            Camara.objects.values('zona__nombre')
            .annotate(total=Count('id'))
            .order_by('-total')
        )
        
        # Distribución por tecnología
        distribucion_tecnologia = list(
            Camara.objects.values('tecnologia')
            .annotate(total=Count('id'))
            .order_by('-total')
        )
        
        # Distribución por tipo
        distribucion_tipo = list(
            Camara.objects.values('tipo')
            .annotate(total=Count('id'))
            .order_by('-total')
        )
        
        # Eventos pendientes y críticos
        eventos_pendientes = Evento.objects.filter(
            estado__in=['pendiente', 'en_atencion']
        ).count()
        
        eventos_criticos = Evento.objects.filter(
            severidad='critica',
            estado__in=['pendiente', 'en_atencion']
        ).count()
        
        data = {
            'total_camaras': total_camaras,
            'camaras_operativas': camaras_operativas,
            'camaras_inactivas': camaras_inactivas,
            'camaras_mantenimiento': camaras_mantenimiento,
            'porcentaje_operativas': porcentaje_operativas,
            'porcentaje_inactivas': porcentaje_inactivas,
            'porcentaje_mantenimiento': porcentaje_mantenimiento,
            'distribucion_por_zona': distribucion_zona,
            'distribucion_por_tecnologia': distribucion_tecnologia,
            'distribucion_por_tipo': distribucion_tipo,
            'eventos_pendientes': eventos_pendientes,
            'eventos_criticos': eventos_criticos
        }
        
        serializer = DashboardSerializer(data)
        return Response(serializer.data)


class DashboardEventosRecientes(APIView):
    """Vista para obtener eventos recientes para el dashboard"""
    @jwt_required
    def get(self, request):
        limit = int(request.GET.get('limit', 10))
        
        eventos = Evento.objects.select_related(
            'camara', 'camara__zona'
        ).order_by('-fecha_registro')[:limit]
        
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data)