import random

from django.http import HttpResponse, JsonResponse
import requests
from bs4 import BeautifulSoup


def fetch_marmiton_url(request):
    url = request.GET.get('url')

    if not url:
        return JsonResponse({"error": "URL parameter is missing."}, status=400)

    # Vérifier que l'URL est valide et commence par "https://www.marmiton.org/recettes/"
    if not url.startswith("https://www.marmiton.org/recettes/"):
        return JsonResponse({"error": "URL is not valid."}, status=400)

    try:
        response = requests.get(url)
        content = response.text
    except requests.RequestException as e:
        return JsonResponse({"error": str(e)}, status=500)

    soup = BeautifulSoup(content, 'html.parser')

    # Trouver la div avec l'id "header" et la supprimer
    header_div = soup.find(id="header")
    if header_div:
        header_div.decompose()  # Supprimer la div

    # Find div with argument data-ad-sticky-reference with any value
    ad_div = soup.find("div", {"data-ad-sticky-reference": True})

    # Get main div __next
    main_div = soup.find(id="__next")
    if not main_div:
        return JsonResponse({"error": "Main div not found."}, status=500)

    # Clear main div and append ad div
    main_div.clear()
    main_div.append(ad_div)

    html_string = str(soup)

    # Get file from STATIC_ROOT / marmiton / custom.js and append it to html_string
    with open('recipes/static/marmiton/custom.js', 'r') as custom_js_file:
        html_string = html_string.replace('</body>', '<script>' + custom_js_file.read() + '</script></body>')

    return HttpResponse(html_string)
