from django.urls import path, include
from . import views

urlpatterns = [
    path('login/', views.alpaca_login, name='alpaca_login'),
    path('callback/', views.alpaca_callback, name='alpaca_callback'),
    path('place_trade/', views.place_trade, name='place_trade'),
]
