from django.contrib import admin
from .models import Recipe, Ingredient, RecipeIngredient, RecipeRating

admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(RecipeIngredient)
admin.site.register(RecipeRating)