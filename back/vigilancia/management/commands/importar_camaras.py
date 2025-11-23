import csv
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from vigilancia.models import Camara, Zona

class Command(BaseCommand):
    help = "Importa cámaras desde un archivo CSV"

    def add_arguments(self, parser):
        parser.add_argument(
            "csv_path",
            type=str,
            help="Ruta al archivo CSV a importar"
        )

    def clean_coordinate(self, value):
        """
        Convierte valores raros como -1206587 → -12.06587
        """
        value = value.replace(",", "").replace(" ", "")

        # Si tiene más de 6 dígitos sin punto, asumimos formato incorrecto
        if "." not in value and len(value) > 6:
            # Insertar el punto después de los primeros 3 dígitos del valor real
            # ej: -1206587 → -12.06587
            return float(value[:3] + "." + value[3:])

        return float(value)

    def handle(self, *args, **options):
        csv_path = options["csv_path"]

        # Obtener o crear zona por defecto
        zona, _ = Zona.objects.get_or_create(nombre="La Perla")

        self.stdout.write(self.style.SUCCESS(f"Usando zona: {zona.nombre}"))

        with open(csv_path, newline='', encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                direccion = row["direccion"]

                # Evitar duplicados por dirección
                if Camara.objects.filter(direccion=direccion).exists():
                    self.stdout.write(
                        self.style.WARNING(f"Saltando duplicado: {direccion}")
                    )
                    continue

                try:
                    lat = self.clean_coordinate(row["latitud"])
                    lon = self.clean_coordinate(row["longitud"])
                except Exception:
                    self.stdout.write(
                        self.style.ERROR(f"Coordenada inválida en: {direccion}")
                    )
                    continue

                ubicacion = Point(float(lon), float(lat), srid=4326)

                cam = Camara.objects.create(
                    direccion=row["direccion"],
                    tecnologia=row["tecnologia"],
                    tipo=row["tipo"],
                    marca=row["marca"],
                    ubicacion=ubicacion,
                    administrador=row["administrador"],
                    zona=zona
                )

                self.stdout.write(
                    self.style.SUCCESS(f"Importada cámara: {cam.direccion}")
                )

        self.stdout.write(self.style.SUCCESS("Importación completa."))
