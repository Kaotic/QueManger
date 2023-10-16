from rest_framework import serializers
from ..models import RecipeImage

class RecipeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeImage
        fields = ('image_url')
