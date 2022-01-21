# Django signals are like hooks
# They allow us to perform some task before or after saving or updating data in model
from django.db.models.signals import pre_save
from django.contrib.auth.models import User

def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email

pre_save.connect(updateUser, sender=User)