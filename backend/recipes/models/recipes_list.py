from django.db import models
from django.contrib.auth.models import User
from .recipe import Recipe

class RecipesList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipes = models.ManyToManyField(Recipe)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Liste de {self.user.username} du {self.date_created.strftime('%d/%m/%Y')}"
