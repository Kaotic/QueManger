from django.db import models
from .ingredient import Ingredient

class Recipe(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Facile'),
        ('medium', 'Moyen'),
        ('hard', 'Difficile'),
    ]

    BUDGET_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyen'),
        ('high', 'Élevé'),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    marmiton_id = models.IntegerField()
    marmiton_url = models.URLField()
    dish_type = models.CharField(max_length=255)
    ingredients = models.ManyToManyField(Ingredient, through='RecipeIngredient')
    author = models.CharField(max_length=255)
    rating = models.FloatField(default=0)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    budget = models.CharField(max_length=10, choices=BUDGET_CHOICES)
    cooking_time = models.IntegerField()
    preparation_time = models.IntegerField()
    recipe_quantity = models.IntegerField()

    def __str__(self):
        return self.name
