from django.db import models
from .recipe import Recipe


class RecipeImage(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="images")
    image_url = models.CharField(max_length=255)

    def __str__(self):
        return f"Image pour {self.recipe.name}"
