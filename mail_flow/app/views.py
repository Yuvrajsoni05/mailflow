from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .decorators import custom_login_required
# Create your views here.

@custom_login_required
def dashboard(request):
    if request.user.is_authenticated:
        messages.success(request, f"Welcome to the dashboard, {request.user.username}!")
    return render(request, 'dashboard.html')


