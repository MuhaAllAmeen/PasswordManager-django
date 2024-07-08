import django
from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.contrib import messages
from django.contrib.auth.models import User, auth
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie,csrf_exempt
from django.utils.decorators import method_decorator

from . import cryptography,helpers
from .models import Website,Credentials
# Create your views here.
def index(request):
    print(request.user)
    return render(request,'index.html')

def login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user_login = auth.authenticate(username=username, password=password)
        print('login',user_login)

        if user_login is not None:
            auth.login(request,user_login)
            print('requesy',request.session.items(),request.user.is_authenticated)
            return redirect('/')
        else:
            messages.info(request,'User not found or credentials invalid')
            return redirect('login')
    else:
        return render (request,'login.html')

def signup(request):
    if request.method == "POST":    
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST["password"]
        password2 = request.POST["password2"]

        if password == password2:
            if User.objects.filter(email=email).exists():
                messages.info(request,"email already exists")
                return redirect('signup')
            elif User.objects.filter(username=username).exists():
                messages.info(request,"username already exists")
                return redirect('signup')
            else:
                user = User.objects.create_user(username=username,email=email,password=password)
                user.save()
                return login(request)
                
        else:
            messages.info(request,"Password are not matching")
            return redirect('signup')
    else:
        return render (request,'signup.html')
    
def logout(request):
    auth.logout(request)
    return redirect('/')

@login_required(login_url='login')
def vault(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'data':'Not Logged In'})
    if request.method == 'POST':
        search_query = request.POST['search']
        if Website.objects.filter(user = user.id).filter(name = search_query).exists():
            websiteDetails = helpers.getCredentialsAsSet(user,Website.objects.filter(user = user.id).filter(name = search_query))
            context = {
            'website_details': websiteDetails
            }
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse(context) #Fetch request from the extension
            return render(request,'vault.html',context)
        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'website_details':'no data'})
            return redirect('vault')
    else:
        websiteDetails = helpers.getCredentialsAsSet(user,Website.objects.filter(user = user.id)) 
        context = {
            'website_details': websiteDetails
        }
        return render(request,'vault.html',context)

@login_required(login_url='login')
@ensure_csrf_cookie
def add(request):
    if request.method == "POST":
        website = request.POST['website']
        username = request.POST['username']
        password = request.POST['password']
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({'error': 'User is not authenticated'})
        encryptedPass = cryptography.crypto(password)
        credentials = Credentials.objects.create(email=username, password=encryptedPass)
        if Website.objects.filter(user = user.id).filter(name=website).exists():
            website_obj = Website.objects.filter(user = user.id).filter(name=website)
            # print(website_obj[0].credentials)
            website_obj[0].credentials.add(credentials)
        else:
            website_obj = Website.objects.create(user=user, name=website)
            website_obj.credentials.add(credentials) 
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest': 
            return JsonResponse({'message':'Credentials Add'})      
        return redirect('add')
    return render(request,'add.html')

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': django.middleware.csrf.get_token(request)})





