from django.contrib import admin
from .models import Ingredient, IngredientRating, Recipe, RecipeIngredient, RecipeRating, RecipesList

admin.site.register(Ingredient, list_display=['name', 'unit_name'])
admin.site.register(IngredientRating)
admin.site.register(Recipe, list_display=['name', 'marmiton_id', 'rating', 'difficulty', 'budget', 'cooking_time', 'preparation_time', 'recipe_quantity'])
admin.site.register(RecipeIngredient, list_display=['ingredient', 'quantity', 'complement', 'recipe'])
admin.site.register(RecipeRating)
admin.site.register(RecipesList)
