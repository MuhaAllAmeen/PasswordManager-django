from django.db import models
from django.contrib.auth.models import User

# Create your models here.



class Credentials(models.Model):
    email = models.CharField(max_length=100)
    password = models.BinaryField(max_length=1000)

class Website(models.Model):
    user = models.ForeignKey(User,related_name='websites', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    credentials = models.ManyToManyField(Credentials)

