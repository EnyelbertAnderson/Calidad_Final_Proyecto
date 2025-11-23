from django.contrib.gis.db import models

class Zona(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Camara(models.Model):
    zona = models.ForeignKey("Zona", on_delete=models.SET_NULL, null=True, default=1)    
    direccion = models.CharField(max_length=255)
    tecnologia = models.CharField(max_length=50)
    tipo = models.CharField(max_length=50)
    marca = models.CharField(max_length=50)
    ubicacion = models.PointField()
    administrador = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.marca} - {self.direccion}"
