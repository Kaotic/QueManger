from rest_framework import serializers
from ..models import Recipe, RecipesList
from .recipe import RecipeSerializer

class RecipesListSerializer(serializers.ModelSerializer):
    recipes = RecipeSerializer(many=True, read_only=True)
    class Meta:
        model = RecipesList
        fields = '__all__'
