#!/bin/sh

while ! nc -z db 5432; do
    echo "En attente de la base de données..."
    sleep 1
done

# Effectuer les migrations
python manage.py migrate --noinput

# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Démarrer le serveur Django
python manage.py runserver 0.0.0.0:8000
