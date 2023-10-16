from rest_framework import serializers
from ..models import Recipe, RecipeImage, RecipeRating, RecipeIngredient

class RecipeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeImage
        fields = ['id', 'image_url']

class RecipeIngredientSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='ingredient.name')
    slug = serializers.ReadOnlyField(source='ingredient.slug')
    image_url = serializers.ReadOnlyField(source='ingredient.image_url')
    unit_name = serializers.ReadOnlyField(source='ingredient.unit_name')

    class Meta:
        model = RecipeIngredient
        fields = ['id', 'name', 'slug', 'image_url', 'complement', 'unit_name', 'quantity']

class RecipeRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeRating
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    images = RecipeImageSerializer(many=True, read_only=True)
    ingredients = RecipeIngredientSerializer(source='recipeingredient_set', many=True, read_only=True)
    ratings = RecipeRatingSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'
