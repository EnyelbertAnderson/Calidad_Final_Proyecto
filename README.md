
# 📘 Proyecto: Calidad_Final_Proyecto — Guía para Colaboradores

Este documento explica cómo trabajar con este proyecto usando **Git**, **Docker**, **Docker Compose**, **PostgreSQL con PostGIS** y cómo compartir datos entre colaboradores mediante **dumps de base de datos**.

---

# 🔧 Requisitos

- **Git** instalado  
- **Docker Desktop** instalado  
- **Docker Compose**  
- Puerto **5432**, **8000** y **8080** disponibles

---

# 📁 Estructura del Proyecto (Resumida)

```
/back
  ├── Dockerfile
  ├── docker-compose.yml
  ├── entrypoint.sh
  ├── requirements.txt
  └── Código Django (Calidad/, vigilancia/, usuarios/, login/, etc.)
```

---

# 🔄 Flujo de Trabajo para Colaboradores

## ✔ 1. Obtener la última versión del proyecto
```sh
git pull
```

Esto actualiza **solo el código**.

🚨 **Importante:**  
La carpeta del proyecto está montada en el contenedor gracias a:

```yaml
volumes:
  - ./:/app
```

Por eso **cada vez que haces git pull, el contenedor web se actualiza solo, obviamente si es que antes hiciste un docker build a los contenedores**.

---

# 🗄 2. Base de Datos: Cómo compartir los datos

La base de datos se ejecuta dentro del contenedor:

```
calidad_db  → PostgreSQL + PostGIS
```

Y **sus datos persisten** en un volumen llamado:

```
pgdata:/var/lib/postgresql/data
```

Para compartir los datos entre colaboradores NO se comparte el volumen.  
**Se exporta un dump .sql**.

---

# 📤 3. Exportar un dump de la base de datos (para compartir datos reales)

Desde tu máquina:

```sh
docker exec -t calidad_db pg_dump -U calidad_user -d calidad > dump.sql
```

Esto genera `dump.sql` en tu carpeta del proyecto.

### Subirlo al repositorio (si así lo deciden)
```sh
git add dump.sql
git commit -m "Dump actualizado + [version]"
git push
```

---

# 📥 4. Restaurar un dump (otro colaborador quiere tus datos)

El colaborador hace:

```sh
git pull
```

Luego importa el dump:

```sh
docker exec -i calidad_db psql -U calidad_user -d calidad < dump.sql
```

Listo. Ahora todos tienen la misma base de datos.

---

# 🐳 Explicación del docker-compose.yml

```yaml
version: "3.8"

services:
  db:
    image: postgis/postgis:15-3.3
    container_name: calidad_db
    environment:
      POSTGRES_DB: calidad
      POSTGRES_USER: calidad_user
      POSTGRES_PASSWORD: calidad_pass
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4:7
    container_name: pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: pgadmin@example.com
      PGADMIN_DEFAULT_PASSWORD: pgadmin
    ports:
      - "8080:80"
    depends_on:
      - db
    restart: unless-stopped

  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: calidad_web
    command: ["gunicorn", "Calidad.wsgi:application", "--bind", "0.0.0.0:8000"]
    volumes:
      - ./:/app
    ports:
      - "8000:8000"
    environment:
      - DEBUG=True
      - SECRET_KEY=${SECRET_KEY:-django-secret}
      - DATABASE_NAME=calidad
      - DATABASE_USER=calidad_user
      - DATABASE_PASSWORD=calidad_pass
      - DATABASE_HOST=db
      - DATABASE_PORT=5432
    depends_on:
      - db
    restart: on-failure

volumes:
  pgdata:
```

### 📌 Qué hace cada servicio

#### **db (PostgreSQL + PostGIS)**
- Guarda los datos del proyecto  
- Persistencia gracias al volumen `pgdata`

#### **pgadmin**
- Panel para administrar la base de datos  
- Se accede en: http://localhost:8080/

#### **web**
- Contenedor que ejecuta **Django + Gunicorn**
- Monta el código local: `./:/app`  
- Cada vez que haces `git pull` → el contenedor usa código actualizado

---

# 🛠 Dockerfile (Explicado)

- Instala dependencias necesarias para trabajar con **GeoDjango** y **PostGIS**
- Instala Python, GDAL, PROJ, libgdal-dev, libpq-dev
- Copia requirements
- Instala dependencias del proyecto
- Arranca Gunicorn

---

# ▶ Cómo levantar todo el proyecto

```sh
docker compose up -d --build
```

Accesos:
- **Backend** → http://localhost:8000/
- **pgAdmin** → http://localhost:8080/

---

# 📌 En resumen (para colaboradores)

### **Cada vez que quieras sincronizarte:**
```sh
git pull
docker compose up -d
```

### **Si hay nuevo dump:**
```sh
docker exec -i calidad_db psql -U calidad_user -d calidad < dump.sql
```

### **Si hiciste cambios en los datos:**
```sh
docker exec -t calidad_db pg_dump -U calidad_user -d calidad > dump.sql
git add dump.sql
git commit -m "Update database dump + [Version]"
git push
```
