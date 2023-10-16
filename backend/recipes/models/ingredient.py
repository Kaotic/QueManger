from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    unit_name = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.CharField(max_length=255)

    def __str__(self):
        return self.name
