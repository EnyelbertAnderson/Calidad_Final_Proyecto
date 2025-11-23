from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ruta
from .serializers import RutaSerializer
from vigilancia.models import Camara
from vigilancia.serializers import CamaraSerializer

class RutaViewSet(viewsets.ModelViewSet):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer

    @action(detail=True, methods=["get"])
    def camaras(self, request, pk=None):
        """Listar cámaras asociadas a la ruta"""
        ruta = self.get_object()
        qs = ruta.camaras.all()
        serializer = CamaraSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="agregar-camaras")
    def agregar_camaras(self, request, pk=None):
        """Agregar cámaras a la ruta (envía lista de IDs)"""
        ruta = self.get_object()
        ids = request.data.get("camaras", [])
        if not isinstance(ids, (list, tuple)):
            return Response({"detail": "Se requiere una lista de IDs en 'camaras'."},
                            status=status.HTTP_400_BAD_REQUEST)
        camaras = Camara.objects.filter(id__in=ids)
        ruta.camaras.add(*camaras)
        return Response({"added": [c.id for c in camaras]})

    @action(detail=True, methods=["post"], url_path="remover-camaras")
    def remover_camaras(self, request, pk=None):
        ruta = self.get_object()
        ids = request.data.get("camaras", [])
        camaras = Camara.objects.filter(id__in=ids)
        ruta.camaras.remove(*camaras)
        return Response({"removed": [c.id for c in camaras]})
