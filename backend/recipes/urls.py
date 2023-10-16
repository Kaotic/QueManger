"""QueManger URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from .api import MarmitonSearchAPI, MarmitonDetailAPI, MarmitonRandomAPI, MarmitonRandomJsonAPI, MarmitonAddRandom, MarmitonAddId
from .api import GetUserRecipeList, AddRecipeToUserRecipeList, RemoveRecipeFromUserRecipeList, ShopListForUserRecipeList

from .views import RecipeListCreate, recipe_list
from .views import IngredientListCreate, ingredient_list

urlpatterns = [
    path('api/marmiton/random', MarmitonRandomJsonAPI.as_view(), name='marmiton_random'),
    path('api/marmiton/add/random', MarmitonAddRandom.as_view(), name='marmiton_add_random'),
    path('api/marmiton/add/id/<int:recipe_id>', MarmitonAddId.as_view(), name='marmiton_add_id'),
    path('api/marmiton/detail/<str:recipe_slug>', MarmitonDetailAPI.as_view(), name='marmiton_detail'),
    path('api/marmiton/search/', MarmitonSearchAPI.as_view(), name='marmiton_search'),

    path('recipes/', RecipeListCreate.as_view(), name='recipes-list-create'),
    path('recipes/list', recipe_list, name='recipes-list'),

    path('ingredients/', IngredientListCreate.as_view(), name='ingredients-list-create'),
    path('ingredients/list', ingredient_list, name='ingredients-list'),

    # User Recipes
    path('api/user/recipes/<int:user_recipe_id>/add/<int:recipe_id>', AddRecipeToUserRecipeList.as_view(), name='user-recipes-add-recipe'),
    path('api/user/recipes/<int:user_recipe_id>/remove/<int:recipe_id>', RemoveRecipeFromUserRecipeList.as_view(), name='user-recipes-remove-recipe'),
    path('api/user/recipes/<int:user_recipe_id>', GetUserRecipeList.as_view(), name='user-recipes-get-list'),
    path('api/user/recipes/<int:user_recipe_id>/shop', ShopListForUserRecipeList.as_view(), name='user-recipes-get-shop-list'),
]
