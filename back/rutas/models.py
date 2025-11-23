from django.contrib.gis.db import models
from django.utils import timezone
from vigilancia.models import Camara  # importa tu modelo existente

class Ruta(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    linea = models.LineStringField(srid=4326)  # SRID 4326 para coords GPS
    camaras = models.ManyToManyField(Camara, blank=True, related_name="rutas")

    def __str__(self):
        return self.nombre
