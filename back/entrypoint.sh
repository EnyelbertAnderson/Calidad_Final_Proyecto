#!/bin/sh

set -e

host="$DATABASE_HOST"
port="$DATABASE_PORT"

echo "Esperando por la base de datos $host:$port ..."
while ! nc -z $host $port; do
  echo "Esperando..."
  sleep 1
done
echo "Base de datos disponible, ejecutando migraciones..."

python manage.py makemigrations --noinput || true
python manage.py migrate --noinput

# recolectar estáticos opcional
python manage.py collectstatic --noinput

# ejecutar el comando pasado al contenedor
exec "$@"
