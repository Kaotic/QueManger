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
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .api import MarmitonRandomJsonAPI, MarmitonAddRandom, MarmitonAddId, AuthTokenObtainPairView, user_registration, \
    fetch_marmiton_url
from .api import GetAllUserRecipeLists, RemoveUserRecipeList, GetUserRecipeList, AddRecipeToUserRecipeList, RemoveRecipeFromUserRecipeList, ShopListForUserRecipeList

from .views import RecipeListCreate, recipe_list, profile_get
from .views import IngredientListCreate, ingredient_list

urlpatterns = [
    # User
    path('profile/', profile_get),
    path('api/token', AuthTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/register', user_registration, name='user_registration'),

    # API Marmiton
    path('api/marmiton/random', MarmitonRandomJsonAPI.as_view(), name='api-marmiton-random'),
    path('api/marmiton/fetch', fetch_marmiton_url, name='api-marmiton-fetch'),
    path('api/marmiton/add/random', MarmitonAddRandom.as_view(), name='api-marmiton-add-random'),
    path('api/marmiton/add/id/<int:recipe_id>', MarmitonAddId.as_view(), name='api-marmiton-add-id'),

    # API User Recipes
    path('api/user/recipes', GetAllUserRecipeLists.as_view(), name='api-user-recipes'),
    path('api/user/recipes/<int:user_recipe_id>', GetUserRecipeList.as_view(), name='api-user-recipes-get'),
    path('api/user/recipes/<int:user_recipe_id>/remove', RemoveUserRecipeList.as_view(), name='api-user-recipes-remove'),
    path('api/user/recipes/<int:user_recipe_id>/shop', ShopListForUserRecipeList.as_view(), name='api-user-recipes-shop-list'),
    path('api/user/recipes/<int:user_recipe_id>/add/<int:recipe_id>', AddRecipeToUserRecipeList.as_view(), name='api-user-recipes-add-recipe'),
    path('api/user/recipes/<int:user_recipe_id>/remove/<int:recipe_id>', RemoveRecipeFromUserRecipeList.as_view(), name='api-user-recipes-remove-recipe'),

    # Base
    path('recipes/', RecipeListCreate.as_view(), name='recipes-list-create'),
    path('recipes/list', recipe_list, name='recipes-list'),

    path('ingredients/', IngredientListCreate.as_view(), name='ingredients-list-create'),
    path('ingredients/list', ingredient_list, name='ingredients-list'),
]
