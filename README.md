# QueManger


https://github.com/Kaotic/QueManger/assets/1755762/e7845f60-5ebe-4ef4-a732-655c230f59a5


## Description
**QueManger** est la solution à tous vos dilemmes culinaires ! Vous êtes-vous déjà demandé ce que vous alliez manger ce soir ? Ou bien avez-vous déjà oublié un ingrédient crucial pendant vos courses ? Avec QueManger, ces problèmes appartiennent désormais au passé. Notre application vous offre la possibilité de créer une liste de recettes basée sur vos préférences, des filtres spécifiques, ou même de manière totalement aléatoire pour chaque semaine. À la fin, QueManger vous génère une liste de courses complète pour toute la semaine, garantissant que vous ne manquiez plus jamais d'un ingrédient.

## Comment démarrer ?

### Docker

1. Compiler le frontend
```bash
chmod +x build-frontend.sh && ./build-frontend.sh
```

2. Démarrer avec Docker
```bash
docker-compose up --build
```

**QueManger** devrait maintenant être accessible à l'adresse [http://localhost:8000](http://localhost:8000).


### Backend

0. Sous Python 3.9.x

1. Naviguez vers le dossier du backend.
```bash
cd backend
```

2. Installez les dépendances.
```bash
pip install -r requirements.txt
```

3. Appliquez les migrations pour configurer la base de données.
```bash
python manage.py migrate
```

4. Collecter les fichiers statiques
```bash
python manage.py collectstatic
```

5. Créez un utilisateur super administrateur si vous souhaitez accéder à l'administration [http://localhost:8000/admin/](http://localhost:8000/admin/).
```bash
python manage.py createsuperuser
```

6. Démarrez le serveur.
```bash
python manage.py runserver
```

Votre backend devrait maintenant être en cours d'exécution à l'adresse [http://localhost:8000](http://localhost:8000).


### Frontend

1. Naviguez vers le dossier du frontend.
```bash
cd frontend
```

2. Installez les dépendances.
```bash
npm install
```

3. Démarrez le serveur de développement React.
```bash
npm start
```

Votre frontend devrait maintenant être accessible à l'adresse [http://localhost:3000](http://localhost:3000).


## Contribuer

Si vous souhaitez contribuer au projet, n'hésitez pas à soumettre une pull request ou à ouvrir un problème pour toute suggestion ou bug.

---

N'oubliez jamais : Avec **QueManger**, dites adieu à l'indécision culinaire et bonjour à une semaine de repas délicieux et bien planifiés !
