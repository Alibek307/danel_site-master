from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'API Overview': '/api',
        'Hello World': '/api/hello/',
        'Health Check': 'api/health',
    }
    return Response(api_urls)

@api_view(['GET'])
def hello_world(request):                                                                                                       
    return Response({"message": "Hello from Django!"}) 

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy", "message": "Django API is running"})

