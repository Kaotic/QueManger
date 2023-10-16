from rest_framework.views import APIView
from rest_framework.response import Response

from ..serializers import RecipeSerializer
from ..external import MarmitonAPI


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