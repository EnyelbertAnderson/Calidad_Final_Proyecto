from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='api-login'),
    path('protected/', views.protected_view, name='api-protected'),
]
