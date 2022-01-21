from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
# IsAuthenticated checks whether the user is authenticated or not
# IsAdminUser checks whether the user is staff or not.
from rest_framework.response import Response

from django.contrib.auth.models import User
from base.serializers import ProductSerializer, UserSerializer, UserSerializerWithToken
from base.products import products

from django.contrib.auth.hashers import make_password
from rest_framework import status

# For customization of jwt claims
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Here we are creating new serializer class inheriting from default serializer class
# We have to modify inside this class to customize the jwt claims(data)
# Validate method of serializer class is responsible to return refresh and access tokens
# So, we can modify it to make it return additional information as well.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data

# This is the class based view
# We are creating a new view, inheriting from the TokenObtainPairView
# And adding our custom serializer class which is modified above 
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Create your views here.

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail':'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True) # It will return the serializer object
    # many=true means that we will be serializing many objects, for single objects it needs to be set False
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    # When a user is logged in using default authentication system
    # request.user will give us the authenticated user object.
    # However, here we are using simplejwt(token based) for authentication,
    # also this view is wrapped by api_view decorator
    # So we are looking for a token, rather than default way of authentication.
    # here, request.user won't be the logged in user which we normally would have.
    # request.user will have the user data from the token we obtain.
    user = request.user
    serializer = UserSerializer(user, many=False) # It will return the serializer object
    # many=False means that we will be serializing and getting back a single user, not a list
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    # When a user is logged in using default authentication system
    # request.user will give us the authenticated user object.
    # However, here we are using simplejwt(token based) for authentication,
    # also this view is wrapped by api_view decorator
    # So we are looking for a token, rather than default way of authentication.
    # here, request.user won't be the logged in user which we normally would have.
    # request.user will have the user data from the token we obtain.
    user = request.user
    serializer = UserSerializerWithToken(user, many=False) # It will return the serializer object
    # many=False means that we will be serializing and getting back a single user, not a list

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    if data['password'] != '' :
        user.password = make_password(data['password'])
    
    user.save()

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserByID(request, pk):
    users = User.objects.get(id=pk)
    serializer = UserSerializer(users, many=False) # It will return the serializer object
    # many=true means that we will be serializing many objects, for single objects it needs to be set False
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data
    
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False) # It will return the serializer object
    # many=False means that we will be serializing and getting back a single user, not a list
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    
    return Response('User deleted.')


