from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login 
from .models import User
from django.contrib import messages

# Create your views here.
def login_page(request):
    if request.user.is_authenticated:
        return redirect('dashboard_page')
    
    try:
        if request.method == 'POST':
            username_email = request.POST.get('username_email')
            password = request.POST.get('password')
            remember_me = request.POST.get('remember_me')
            
            print(f"Username/Email: {username_email}, Password: {password}")
            try:
                user = User.objects.get(email=username_email.lower())
                

            except User.DoesNotExist:
                messages.error(request, "Email not found.")
                return redirect('login_page')
            
            user = authenticate(request, username=user.username, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(
                    request,
                    f"You are signed in {user.username}"
                )
                return redirect('dashboard_page')
            else:
                messages.error(request, "Invalid credentials.")
                return redirect('login_page')
    except Exception as e:
        messages.error(request, "An error occurred during login. Please try again.")
        print(f"An error occurred during login: {e}")
        return redirect('login_page')
    
            
                
            
            
                
            
    
    
    
    
    return render(request, 'auth/login.html')


def register(request):
    return render(request, 'auth/signup.html')