import json

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def user_registration(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not username or not password or not email:
            return JsonResponse({"error": "Veuillez remplir tous les champs!"}, status=400)

        if len(username) < 3 or len(username) > 150:
            return JsonResponse({"error": "Le nom d'utilisateur doit contenir entre 3 et 150 caractères!"}, status=400)

        if len(password) < 8 or len(password) > 128:
            return JsonResponse({"error": "Le mot de passe doit contenir entre 8 et 128 caractères!"}, status=400)

        if len(email) < 3 or len(email) > 254:
            return JsonResponse({"error": "L'email doit contenir entre 3 et 254 caractères!"}, status=400)

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({"error": "L'email doit être valide!"}, status=400)

        if not User.objects.filter(username=username).exists():
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(username=username, password=password, email=email)
                return JsonResponse({"message": "Utilisateur créé avec succès!"}, status=201)
            else:
                return JsonResponse({"error": "Email déjà pris!"}, status=400)
        else:
            return JsonResponse({"error": "Nom d'utilisateur déjà pris!"}, status=400)
    return JsonResponse({"error": "Mauvaise requête."}, status=400)
