from django.http import HttpResponse
from PIL import Image
import io
import requests

ALLOWED_URLS = [
    'https://static.750g.com/',
    'https://assets.afcdn.com/',
]


def proxy_image(request):
    url = request.GET.get('url')
    width = request.GET.get('width', 256)
    height = request.GET.get('height', 256)

    if not url:
        return HttpResponse("URL parameter is missing.", status=400)

    if not url.startswith(tuple(ALLOWED_URLS)):
        return HttpResponse("URL is not valid.", status=400)

    try:
        response = requests.get(url)
        image = Image.open(io.BytesIO(response.content))

        # Resize image if dimensions are provided
        if width and height:
            image = image.resize((int(width), int(height)))

        # Convert the image to bytes again and serve
        byte_array = io.BytesIO()
        image.save(byte_array, format='JPEG')

        http_response = HttpResponse(byte_array.getvalue(), content_type="image/jpeg")
        http_response["Cache-Control"] = "public, max-age=86400"

        return http_response
    except Exception as e:
        with open('recipes/static/images/ingredient_default.jpg', 'rb') as default_image:
            return HttpResponse(default_image.read(), content_type="image/jpeg")
