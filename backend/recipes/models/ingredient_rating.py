from django.db import models
from django.contrib.auth.models import User
from .ingredient import Ingredient


class IngredientRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    rate = models.FloatField()
    date_rated = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note de {self.user.username} pour {self.ingredient.name} : {self.rate}/5"
