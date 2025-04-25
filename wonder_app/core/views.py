from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializer import UserSerializer
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.http import HttpRequest, HttpResponse, JsonResponse
from alpaca_integration.forms import AlpacaInvestForm



# Create your views here. (this is where the api endpoints will live)
"""User Views"""
@api_view(['GET'])
def get_user(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE',])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
"Home Views"

def home(request):
    return render(request, "home.html", {})

@login_required
def invest(request: HttpRequest) -> HttpResponse:
    user = request.user
    form = AlpacaInvestForm()
    return render(request, "invest.html", {'form': form, 'user': user})

@login_required
def account_dashboard(request):
    return render(request, "account_dashboard.html", {})

"""auth views"""
def authView(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST or None)
        if form.is_valid():
            form.save()
            return redirect("core:login")
    else:
        form = UserCreationForm()
    return render(request, "registration/signup.html", {"form": form})

"""future value calculation"""
@api_view(['POST'])
def FV(request):
    try:
        amount = float(request.data.get('amount'))
        discount_rate = float(request.data.get('discount_rate'))
        time = float(request.data.get('time'))
    except (TypeError, ValueError):
        return Response({"error": "Invalid input data. Ensure all fields are provided and are numeric."}, status=status.HTTP_400_BAD_REQUEST)
    
    future_value = amount * (1 + (discount_rate/100))**time
    
    return Response({"future_value": future_value}, status=status.HTTP_200_OK)




