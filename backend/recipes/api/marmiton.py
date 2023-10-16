from django.shortcuts import render
from rest_framework import generics
from ..models import Recipe
from ..serializers import RecipeSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..external import MarmitonAPI, Marmiton, RecipeNotFound

class MarmitonSearchAPI(APIView):
    def get(self, request, format=None):
        query_dict = request.query_params.dict()
        results = Marmiton.search(query_dict)
        return Response(results)

class MarmitonDetailAPI(APIView):
    def get(self, request, recipe_slug, format=None):
        try:
            recipe_details = Marmiton.get(f"/recettes/{recipe_slug}.aspx")
            return Response(recipe_details)
        except RecipeNotFound:
            return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)

class MarmitonRandomAPI(APIView):
    def get(self, request, format=None):
        random_recipe = Marmiton.get_random()
        return Response(random_recipe)

class MarmitonRandomJsonAPI(APIView):
    def get(self, request, format=None):
        random_recipe = MarmitonAPI.get_random_recipe()
        return Response(random_recipe)

class MarmitonAddRandom(APIView):
    def get(self, request, format=None):
        random_recipe = MarmitonAPI.get_random_recipe()
        new_recipe = MarmitonAPI.add_recipe_to_db(random_recipe)
        return Response(RecipeSerializer(new_recipe).data)

class MarmitonAddId(APIView):
    def get(self, request, recipe_id, format=None):
        new_recipe = MarmitonAPI.add_recipe_id_to_db(recipe_id)
        return Response(RecipeSerializer(new_recipe).data)