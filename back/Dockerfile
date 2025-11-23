# base image
FROM python:3.11-slim

# instalar dependencias del sistema para GDAL/PostGIS y netcat
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    binutils \
    gdal-bin \
    libproj-dev \
    libgdal-dev \
    libpq-dev \
    gettext \
    curl \
    netcat-openbsd \
    # Limpieza para reducir el tamaño de la imagen
    && rm -rf /var/lib/apt/lists/*

# configurar variables de entorno para compilación de GDAL
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

WORKDIR /app

# copiar requirements
COPY requirements.txt /app/requirements.txt

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

# entrypoint
# Copia el script de inicio
COPY ./entrypoint.sh /entrypoint.sh
# *** CRITICAL FIX: Eliminar saltos de línea de Windows (CRLF) y asegurar permisos de ejecución ***
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "Calidad.wsgi:application", "--bind", "0.0.0.0:8000"]
