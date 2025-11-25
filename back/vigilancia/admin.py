from django.contrib.gis import admin
from .models import Zona, Camara, Evento


@admin.register(Zona)
class ZonaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']
    search_fields = ['nombre']


@admin.register(Camara)
class CamaraAdmin(admin.GISModelAdmin):  # ← CAMBIÓ AQUÍ: GISModelAdmin en lugar de OSMGeoAdmin
    list_display = ['id', 'direccion', 'marca', 'tecnologia', 'tipo', 'estado', 'zona']
    list_filter = ['estado', 'tecnologia', 'tipo', 'zona']
    search_fields = ['direccion', 'marca', 'administrador']
    list_editable = ['estado']


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'camara', 
        'tipo', 
        'severidad', 
        'estado', 
        'fecha_registro',
        'atendido_por'
    ]
    list_filter = ['tipo', 'severidad', 'estado', 'fecha_registro']
    search_fields = ['titulo', 'descripcion', 'camara__direccion']
    list_editable = ['estado']
    date_hierarchy = 'fecha_registro'
    readonly_fields = ['fecha_registro']
    
    fieldsets = (
        ('Información General', {
            'fields': ('camara', 'tipo', 'severidad', 'estado', 'titulo', 'descripcion')
        }),
        ('Fechas', {
            'fields': ('fecha_registro', 'fecha_resolucion')
        }),
        ('Personal', {
            'fields': ('reportado_por', 'atendido_por', 'notas_resolucion')
        }),
    )