from rest_framework import serializers
from ..models import RecipeRating

class RecipeRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeRating
        fields = '__all__'
