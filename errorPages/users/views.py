from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import CustomUserCreationForm, CustomUserLoginForm
from django.contrib.auth.decorators import login_required
from .message import Message
import json
import re

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        
        if form.is_valid():
            user = form.save()
            login(request, user) 
            return redirect('home') 
        else:
            email = request.POST.get("email", "")
            password1 = request.POST.get("password1", "")
            control_number = request.POST.get("control_number", "")
            tel = request.POST.get("tel", "")
            password2 = request.POST.get("password2", "")
            regex = r"^[a-zA-Z0-9._%+-]+@utez\.edu\.mx$"

            if not re.match(regex, email):  
                message = Message("info", "El correo debe pertenecer al dominio @utez.edu.mx", 200, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkJoNAX-3gJ98M333ghNWVh-Cfha4zqNd-tw&s")
                return render(request, "register.html", { "form": form, "message": json.dumps(message.to_dict())})
            
            regex = r"^(?=.*[!#$%&?])(?=.*\d)[A-Za-z\d!#$%&?]{8,}$"
            if not re.match(regex, password1):
                message = Message("info", "La contraseña debe contener al menos 1 número y 1 símbolo", 200, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkJoNAX-3gJ98M333ghNWVh-Cfha4zqNd-tw&s")
                return render(request, "register.html", { "form": form, "message": json.dumps(message.to_dict())})
            
            regex = r"^\d{5}[a-zA-Z]{2}\d{3}$"
            if not re.match(regex, control_number):
                message = Message("info", "La matrícula debe pertenecer a la UTEZ y debe tener 10 caracteres", 200, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkJoNAX-3gJ98M333ghNWVh-Cfha4zqNd-tw&s")
                return render(request, "register.html", { "form": form, "message": json.dumps(message.to_dict())})
            
            regex = r"^[0-9]{10}$"
            if not re.match(regex, tel):
                message = Message("info", "El número telefonico debe tener 10 caracteres", 200, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkJoNAX-3gJ98M333ghNWVh-Cfha4zqNd-tw&s")
                return render(request, "register.html", { "form": form, "message": json.dumps(message.to_dict())})
            
            if password1 != password2:
                message = Message("info", "Las contraseñas no coinciden", 200, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkJoNAX-3gJ98M333ghNWVh-Cfha4zqNd-tw&s")
                return render(request, "register.html", { "form": form, "message": json.dumps(message.to_dict())})

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

    message = Message("info", "Se a cerrado session exitosamente", 200, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8MIbugIhZBykSmQcR0QPcfnPUBOZQ6bm35w&s")
    return render(request, "login.html", {"message": json.dumps(message.to_dict())})

@login_required
def home_view(request):
    return render(request, 'home.html')