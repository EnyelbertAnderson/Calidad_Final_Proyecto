from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.gis.geos import Point
from django.db.models import Q

from login.views import jwt_required
from .models import Camara, Zona
from .serializers import (
    ZonaSerializer,
    CamaraSerializer,
    CamaraGeoSerializer
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

        if tecnologia:
            qs = qs.filter(tecnologia__icontains=tecnologia)

        if tipo:
            qs = qs.filter(tipo__icontains=tipo)

        if marca:
            qs = qs.filter(marca__icontains=marca)

        if zona:
            qs = qs.filter(zona__nombre__icontains=zona)

        serializer = CamaraSerializer(qs, many=True)
        return Response(serializer.data)


class CamaraGeo(APIView):
    @jwt_required
    def get(self, request):
        qs = Camara.objects.all()

        tecnologia = request.GET.get("tecnologia")
        tipo = request.GET.get("tipo")
        marca = request.GET.get("marca")
        zona = request.GET.get("zona")

        if tecnologia:
            qs = qs.filter(tecnologia__icontains=tecnologia)

        if tipo:
            qs = qs.filter(tipo__icontains=tipo)

        if marca:
            qs = qs.filter(marca__icontains=marca)

        if zona:
            qs = qs.filter(zona__nombre__icontains=zona)

        serializer = CamaraGeoSerializer(qs, many=True)
        return Response(serializer.data)
