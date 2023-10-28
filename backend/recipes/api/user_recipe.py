from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import Recipe, RecipesList
from ..external import MarmitonAPI
from ..serializers import RecipesListSerializer


class GetAllUserRecipeLists(APIView):
    def get(self, request, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to add a recipe to a list"}, status=status.HTTP_401_UNAUTHORIZED)

            user_recipes = RecipesList.objects.filter(user=request.user)
            return Response(RecipesListSerializer(user_recipes, many=True).data)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateUserRecipeList(APIView):
    def get(self, request, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to add a recipe to a list"}, status=status.HTTP_401_UNAUTHORIZED)

            user_recipe = RecipesList.objects.create(user=request.user)
            return Response(RecipesListSerializer(user_recipe).data)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RemoveUserRecipeList(APIView):
    def get(self, request, user_recipe_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to add a recipe to a list"}, status=status.HTTP_401_UNAUTHORIZED)

            try:
                user_recipe = RecipesList.objects.get(id=user_recipe_id)
                if user_recipe.user != request.user:
                    return Response({"error": "You must be the owner of the list to add a recipe"}, status=status.HTTP_401_UNAUTHORIZED)
            except RecipesList.DoesNotExist:
                return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

            user_recipe.delete()

            return Response({"success": "List deleted"})
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetUserRecipeList(APIView):
    def get(self, request, user_recipe_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to add a recipe to a list"}, status=status.HTTP_401_UNAUTHORIZED)

            try:
                user_recipe = RecipesList.objects.get(id=user_recipe_id)
                if user_recipe.user != request.user:
                    return Response({"error": "You must be the owner of the list to add a recipe"}, status=status.HTTP_401_UNAUTHORIZED)
            except RecipesList.DoesNotExist:
                return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response(RecipesListSerializer(user_recipe).data)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddRecipeToUserRecipeList(APIView):
    def get(self, request, user_recipe_id, recipe_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to add a recipe to a list"}, status=status.HTTP_401_UNAUTHORIZED)

            if user_recipe_id == "0" or user_recipe_id == 0:
                user_recipe = RecipesList.objects.create(user=request.user)
            else:
                try:
                    user_recipe = RecipesList.objects.get(id=user_recipe_id)
                    if user_recipe.user != request.user:
                        return Response({"error": "You must be the owner of the list to add a recipe"}, status=status.HTTP_401_UNAUTHORIZED)
                except RecipesList.DoesNotExist:
                    return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                recipe = Recipe.objects.get(marmiton_id=recipe_id)
            except Recipe.DoesNotExist:
                try:
                    marmiton_recipe = MarmitonAPI.get_recipe_by_id(recipe_id)
                    if marmiton_recipe is None or marmiton_recipe.get("error") is not None:
                        return Response({"error": "Recipe on Marmiton not found"}, status=status.HTTP_404_NOT_FOUND)
                    recipe = MarmitonAPI.add_recipe_to_db(marmiton_recipe)
                except Exception as e:
                    return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)

            if not recipe in user_recipe.recipes.all():
                user_recipe.recipes.add(recipe)
                user_recipe.save()

            return Response(RecipesListSerializer(user_recipe).data)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RemoveRecipeFromUserRecipeList(APIView):
    def get(self, request, user_recipe_id, recipe_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to remove a recipe from a list"}, status=status.HTTP_401_UNAUTHORIZED)

            try:
                user_recipe = RecipesList.objects.get(id=user_recipe_id)
                if user_recipe.user != request.user:
                    return Response({"error": "You must be the owner of the list to remove a recipe"}, status=status.HTTP_401_UNAUTHORIZED)
            except RecipesList.DoesNotExist:
                return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                recipe = Recipe.objects.get(marmiton_id=recipe_id)
            except Recipe.DoesNotExist:
                return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)

            if recipe in user_recipe.recipes.all():
                user_recipe.recipes.remove(recipe)
                user_recipe.save()

            return Response(RecipesListSerializer(user_recipe).data)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ShopListForUserRecipeList(APIView):
    def get(self, request, user_recipe_id, format=None):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to add a recipe to a list"}, status=status.HTTP_401_UNAUTHORIZED)

            try:
                user_recipe = RecipesList.objects.get(id=user_recipe_id)
                if user_recipe.user != request.user:
                    return Response({"error": "You must be the owner of the list to add a recipe"}, status=status.HTTP_401_UNAUTHORIZED)
            except RecipesList.DoesNotExist:
                return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

            ingredients_list = []
            for recipe in user_recipe.recipes.all():
                for recipe_ingredient in recipe.ingredients.through.objects.filter(recipe=recipe):
                    ingredient_found = False
                    for ingredient in ingredients_list:
                        if ingredient["id"] == recipe_ingredient.ingredient.id:
                            ingredient_found = True
                            if recipe_ingredient.complement is not None:
                                if ingredient.get("complement") is None:
                                    ingredient["complement"] = recipe_ingredient.complement
                                else:
                                    ingredient["complement"] += f" + {recipe_ingredient.complement}"
                                ingredient["quantity"] += recipe_ingredient.quantity
                            break

                    if not ingredient_found:
                        ingredients_list.append({
                            "id": recipe_ingredient.ingredient.id,
                            "name": recipe_ingredient.ingredient.name[0].upper() + recipe_ingredient.ingredient.name[1:],
                            "complement": recipe_ingredient.complement,
                            "quantity": recipe_ingredient.quantity,
                            "unit_name": recipe_ingredient.ingredient.unit_name,
                            "image_url": recipe_ingredient.ingredient.image_url,
                        })

            # Return the list of ingredients JSON formatted
            return Response(ingredients_list)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
