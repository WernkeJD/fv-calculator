from django.urls import path, include
from . import views

urlpatterns = [
    path("accounts/", include("django.contrib.auth.urls")),
    path("", views.home, name="home"),
    path("signup/", views.authView, name="authview"),
    path('users/', views.get_user, name='get_user'),
    path('users/create/', views.create_user, name='create_user'),
    path('users/<int:pk>', views.user_detail, name='user_detail'),
    path('calculate-future-value/', views.FV, name='FV'),
    path('invest/', views.invest , name='invest_page'),
    path('accounts-dashboard/', views.account_dashboard , name='account_dashboard'),
    path('policies/privacy/', views.privacy_policy, name='privacy_policy'),
    path('api/ocr/', views.ocr_proxy, name='ocr_proxy'),
]