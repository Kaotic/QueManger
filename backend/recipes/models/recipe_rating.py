from django.db import models
from django.contrib.auth.models import User
from .recipe import Recipe

class RecipeRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ratings")
    rate = models.FloatField()
    date_rated = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note de {self.user.username} pour {self.recipe.name} : {self.rate}/5"
