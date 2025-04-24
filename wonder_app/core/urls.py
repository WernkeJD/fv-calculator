from django.urls import path, include
from .views import get_user, create_user, user_detail, home, authView, FV

urlpatterns = [
    path("accounts/", include("django.contrib.auth.urls")),
    path("", home, name="home"),
    path("signup/", authView, name="authview"),
    path('users/', get_user, name='get_user'),
    path('users/create/', create_user, name='create_user'),
    path('users/<int:pk>', user_detail, name='user_detail'),
    path('calculate-future-value/', FV, name='FV'),
]