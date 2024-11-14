from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, ProfileSerializer
from .models import Profile

@api_view(['POST'])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if username and password:
        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh':str(refresh),
            'access':str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'profile'):
            Profile.objects.create(user=request.user)
        
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        if not hasattr(request.user, 'profile'):
            Profile.objects.create(user=request.user)
        
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            profile.save() 
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)