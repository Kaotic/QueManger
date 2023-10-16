from django.db import models
from .ingredient import Ingredient
from .recipe import Recipe


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    complement = models.CharField(max_length=255, blank=True, null=True)
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.ingredient.name} ({self.complement}) - {self.ingredient.unit_name or 'x'}{self.quantity}"
