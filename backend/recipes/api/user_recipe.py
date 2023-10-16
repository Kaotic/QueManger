import json

from django.shortcuts import render
from rest_framework import generics
from ..models import Recipe, RecipesList
from ..serializers import RecipeSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..external import MarmitonAPI
from ..serializers import RecipesListSerializer


class GetUserRecipeList(APIView):
    def get(self, request, user_recipe_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to add a recipe to a list"},
                                status=status.HTTP_401_UNAUTHORIZED)

            try:
                user_recipe = RecipesList.objects.get(id=user_recipe_id)
                if user_recipe.user != request.user:
                    return Response({"error": "You must be the owner of the list to add a recipe"},
                                    status=status.HTTP_401_UNAUTHORIZED)
            except RecipesList.DoesNotExist:
                return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response(RecipesListSerializer(user_recipe).data)
        except:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddRecipeToUserRecipeList(APIView):
    def get(self, request, user_recipe_id, recipe_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to add a recipe to a list"},
                                status=status.HTTP_401_UNAUTHORIZED)

            user_recipe = None

            if user_recipe_id == "0" or user_recipe_id == 0:
                user_recipe = RecipesList.objects.create(user=request.user)
            else:
                try:
                    user_recipe = RecipesList.objects.get(id=user_recipe_id)
                    if user_recipe.user != request.user:
                        return Response({"error": "You must be the owner of the list to add a recipe"},
                                        status=status.HTTP_401_UNAUTHORIZED)
                except RecipesList.DoesNotExist:
                    return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

            recipe = None
            try:
                recipe = Recipe.objects.get(marmiton_id=recipe_id)
            except Recipe.DoesNotExist:
                try:
                    marmiton_recipe = MarmitonAPI.get_recipe_by_id(recipe_id)
                    if marmiton_recipe is None or marmiton_recipe.get("error") is not None:
                        return Response({"error": "Recipe on Marmiton not found"}, status=status.HTTP_404_NOT_FOUND)
                    recipe = MarmitonAPI.add_recipe_to_db(marmiton_recipe)
                except:
                    return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)

            if not recipe in user_recipe.recipes.all():
                user_recipe.recipes.add(recipe)
                user_recipe.save()

            return Response(RecipesListSerializer(user_recipe).data)
        except:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RemoveRecipeFromUserRecipeList(APIView):
    def get(self, request, user_recipe_id, recipe_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to remove a recipe from a list"},
                                status=status.HTTP_401_UNAUTHORIZED)

            try:
                user_recipe = RecipesList.objects.get(id=user_recipe_id)
                if user_recipe.user != request.user:
                    return Response({"error": "You must be the owner of the list to remove a recipe"},
                                    status=status.HTTP_401_UNAUTHORIZED)
            except RecipesList.DoesNotExist:
                return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

            recipe = None
            try:
                recipe = Recipe.objects.get(marmiton_id=recipe_id)
            except Recipe.DoesNotExist:
                return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)

            if recipe in user_recipe.recipes.all():
                user_recipe.recipes.remove(recipe)
                user_recipe.save()

            return Response(RecipesListSerializer(user_recipe).data)
        except:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ShopListForUserRecipeList(APIView):
    def get(self, request, user_recipe_id, format=None):
        try:
            print("test")
        except:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not request.user.is_authenticated:
            return Response({"error": "You must be logged in to add a recipe to a list"},
                            status=status.HTTP_401_UNAUTHORIZED)

        try:
            user_recipe = RecipesList.objects.get(id=user_recipe_id)
            if user_recipe.user != request.user:
                return Response({"error": "You must be the owner of the list to add a recipe"},
                                status=status.HTTP_401_UNAUTHORIZED)
        except RecipesList.DoesNotExist:
            return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

        # Foreach recipes in the list, takes all ingredients and add them to the final list

        ingredients_list = []
        for recipe in user_recipe.recipes.all():
            for recipe_ingredient in recipe.ingredients.all():
                # print type of recipe_ingredient
                print(type(recipe_ingredient))
                # if ingredient is not in the list, add it with quantity, otherwise, add quantity to the existing ingredient
                ingredient_found = False
                for ingredient in ingredients_list:
                    if ingredient["name"] == recipe_ingredient.name:
                        ingredient_found = True
                        ingredient["quantity"] += recipe_ingredient.quantity
                        break

                if not ingredient_found:
                    ingredients_list.append({
                        "name": recipe_ingredient.name,
                        "complement": recipe_ingredient.complement if recipe_ingredient.complement else "",
                        "quantity": recipe_ingredient.quantity,
                        "unit_name": recipe_ingredient.unit_name,
                    })

        # Return the list of ingredients JSON formatted
        return Response(json.dumps(ingredients_list))
