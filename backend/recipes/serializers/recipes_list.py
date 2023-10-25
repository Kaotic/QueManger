from rest_framework import serializers
from ..models import RecipesList
from .recipe import RecipeSerializer


class DateTimeToWeekIntegerField(serializers.IntegerField):
    def to_representation(self, value):
        return int(value.strftime("%W"))


class RecipesListSerializer(serializers.ModelSerializer):
    recipes = RecipeSerializer(many=True, read_only=True)
    date_week = DateTimeToWeekIntegerField(read_only=True, source='date_created')

    class Meta:
        model = RecipesList
        fields = '__all__'
