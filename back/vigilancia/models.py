from django.contrib.gis.db import models
from django.utils import timezone

class Zona(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Camara(models.Model):
    ESTADO_CHOICES = [
        ('operativa', 'Operativa'),
        ('inactiva', 'Inactiva'),
        ('mantenimiento', 'En Mantenimiento'),
    ]
    
    zona = models.ForeignKey("Zona", on_delete=models.SET_NULL, null=True, default=1)    
    direccion = models.CharField(max_length=255)
    tecnologia = models.CharField(max_length=50)
    tipo = models.CharField(max_length=50)
    marca = models.CharField(max_length=50)
    ubicacion = models.PointField(srid=4326)
    administrador = models.CharField(max_length=255)
    estado = models.CharField(
        max_length=20, 
        choices=ESTADO_CHOICES, 
        default='operativa'
    )
    fecha_instalacion = models.DateField(null=True, blank=True)
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Cámara"
        verbose_name_plural = "Cámaras"
        ordering = ['-id']

    def __str__(self):
        return f"{self.marca} - {self.direccion}"


class Evento(models.Model):
    TIPO_CHOICES = [
        ('fallo_tecnico', 'Fallo Técnico'),
        ('mantenimiento', 'Mantenimiento Programado'),
        ('vandalismo', 'Vandalismo'),
        ('desconexion', 'Desconexión'),
        ('alerta', 'Alerta de Seguridad'),
        ('otro', 'Otro'),
    ]
    
    SEVERIDAD_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('critica', 'Crítica'),
    ]
    
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_atencion', 'En Atención'),
        ('resuelto', 'Resuelto'),
        ('cerrado', 'Cerrado'),
    ]
    
    camara = models.ForeignKey(
        Camara, 
        on_delete=models.CASCADE, 
        related_name='eventos'
    )
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    severidad = models.CharField(max_length=10, choices=SEVERIDAD_CHOICES)
    estado = models.CharField(
        max_length=15, 
        choices=ESTADO_CHOICES, 
        default='pendiente'
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_registro = models.DateTimeField(default=timezone.now)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    reportado_por = models.CharField(max_length=100, blank=True)
    atendido_por = models.CharField(max_length=100, blank=True, null=True)
    notas_resolucion = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ['-fecha_registro']
    
    def __str__(self):
        return f"{self.get_tipo_display()} - {self.camara.direccion} ({self.fecha_registro.strftime('%d/%m/%Y')})"