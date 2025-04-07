from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import CustomUserCreationForm, CustomUserLoginForm
from django.contrib.auth.decorators import login_required
from .message import message
import re
def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        email= request.POST.get("email","")
        regex = r"^[a-zA-Z0-9]+@utez\.edu\.mx$"

        if not re.match(regex, email):
            message= message("INFO","El correo nopertenece a la institucion")

        if form.is_valid():
            user = form.save()
            login(request, user) # Iniciar sesión después del registro
            return redirect('home') # Redirigir a la página principal
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = CustomUserLoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserLoginForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    message = message("info", "Se a cerrado session exitosamente", 200, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8MIbugIhZBykSmQcR0QPcfnPUBOZQ6bm35w&s")

    return render(request, "login.html", {"message": json.dumps(message.to_dict())})

@login_required
def home_view(request):
    return render(request, 'home.html')