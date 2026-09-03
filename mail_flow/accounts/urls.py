# from django.contrib import admin
from django.urls import path
from .views import login_page, register
urlpatterns = [
    path('', login_page, name='login_page'),
    path('register/', register, name='register')
    
]
