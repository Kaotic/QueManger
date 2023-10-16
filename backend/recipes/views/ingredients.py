from django.shortcuts import render
from rest_framework import generics
from ..models import Ingredient
from ..serializers import IngredientSerializer

class IngredientListCreate(generics.ListCreateAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

def ingredient_list(request):
    ingredients = Ingredient.objects.all()
    return render(request, 'ingredients/ingredients_list.html', {'ingredients': ingredients})