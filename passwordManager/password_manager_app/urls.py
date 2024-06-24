from . import views
from django.urls import path

urlpatterns = [
    path('',views.index,name='index'),
    path('login',views.login,name='login'),
    path('signup',views.signup,name='signup'),
    path('logout',views.logout,name='logout'),
    path('vault',views.vault,name='vault'),
    path('add',views.add,name='add')
]