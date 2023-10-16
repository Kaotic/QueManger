import requests
import re

from ..models import Recipe, Ingredient, RecipeIngredient, RecipeImage


class MarmitonAPI:
    @staticmethod
    def get_random_recipe_url():
        """Obtient la nouvelle location de l'URL."""
        response = requests.get("https://www.marmiton.org/recettes/recette-hasard.aspx?v=2", allow_redirects=False)
        return response.headers.get("Location")

    @staticmethod
    def extract_id_from_url(url):
        """Extrait l'ID d'une URL Marmiton."""
        match = re.search(r"_([0-9]+)\.aspx$", url)
        return int(match.group(1)) if match else None

    @staticmethod
    def get_recipe_by_id(recipe_id):
        """Récupère une recette depuis l'API Marmiton en utilisant l'ID."""
        url = f"https://api-uno.marmiton.org/recipe/{recipe_id}"
        response = requests.get(url)
        return response.json()

    @staticmethod
    def get_random_recipe():
        """Récupère une recette aléatoire depuis l'API Marmiton."""
        url = MarmitonAPI.get_random_recipe_url()
        recipe_id = MarmitonAPI.extract_id_from_url(url)
        return MarmitonAPI.get_recipe_by_id(recipe_id)

    @staticmethod
    def translate_cost(cost_token):
        """Traduit le coût d'une recette."""
        cost_dict = {
            "bonmarche": "low",
            "moyen": "medium",
            "assezcher": "high",
        }
        return cost_dict.get(cost_token, None)

    @staticmethod
    def translate_difficulty(difficulty_token):
        """Traduit la difficulté d'une recette."""
        difficulty_dict = {
            "tresfacile": "easy",
            "facile": "easy",
            "moyen": "medium",
            "moyenne": "medium",
            "difficile": "hard",
        }
        return difficulty_dict.get(difficulty_token, None)

    @staticmethod
    def add_recipe_to_db(recipe):
        """Ajoute une recette à la base de données."""
        new_recipe = None

        try:
            new_recipe = Recipe.objects.get(marmiton_id=recipe["id"])
        except Recipe.DoesNotExist:
            new_recipe = Recipe.objects.create(
                name=recipe["title"],
                slug=recipe["seoUrl"],
                marmiton_id=recipe["id"],
                marmiton_url=f"https://www.marmiton.org{recipe['url']}",
                dish_type=recipe["dishType"]["name"],
                author=recipe["author"]["name"],
                rating=recipe["rating"],
                difficulty=MarmitonAPI.translate_difficulty(recipe["difficulty"]["token"]),
                budget=MarmitonAPI.translate_cost(recipe["cost"]["token"]),
                cooking_time=recipe["cookingTime"],
                preparation_time=recipe["preparationTime"],
                recipe_quantity=recipe["servings"]["count"] if recipe["servings"] else None,
            )

            for ingredientGroup in recipe["ingredientGroups"]:
                for ingredient in ingredientGroup["items"]:
                    new_ingredient = None

                    try:
                        new_ingredient = Ingredient.objects.get(slug=ingredient["token"])
                    except Ingredient.DoesNotExist:
                        image_url = 'https://assets.afcdn.com/recipe/20100101/ingredient_default.jpg'

                        try:
                            if ingredient["picture"]:
                                if ingredient["picture"]["pictureUrls"]:
                                    image_url = ingredient["picture"]["pictureUrls"]["origin"]
                                elif ingredient["picture"]["picturePath"]:
                                    picture_path = ingredient["picture"]["picturePath"]
                                    image_url = f"https://assets.afcdn.com/{picture_path}_origin.jpg"
                        except KeyError:
                            pass

                        new_ingredient = Ingredient.objects.create(
                            name=ingredient["name"],
                            slug=ingredient["token"],
                            unit_name=ingredient["unitName"] if ingredient["unitName"] else None,
                            image_url=image_url,
                        )

                    RecipeIngredient.objects.create(
                        recipe=new_recipe,
                        ingredient=new_ingredient,
                        complement=ingredient["complement"] if ingredient["complement"] else None,
                        quantity=ingredient["ingredientQuantity"] if ingredient["ingredientQuantity"] else 0,
                    )

            for picture in recipe["picturesPreview"]:
                RecipeImage.objects.create(recipe=new_recipe, image_url=picture["pictureUrls"]["origin"])

        return new_recipe

    @staticmethod
    def add_recipe_id_to_db(recipe_id):
        """Ajoute une recette à la base de données en utilisant son ID."""
        recipe = MarmitonAPI.get_recipe_by_id(recipe_id)
        return MarmitonAPI.add_recipe_to_db(recipe)

    @staticmethod
    def add_recipe_url_to_db(recipe_url):
        """Ajoute une recette à la base de données en utilisant son URL."""
        recipe_id = MarmitonAPI.extract_id_from_url(recipe_url)
        recipe = MarmitonAPI.get_recipe_by_id(recipe_id)
        return MarmitonAPI.add_recipe_to_db(recipe)


