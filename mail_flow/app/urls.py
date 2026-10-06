from django.contrib import admin
from django.urls import path
from .views import dashboard, template_view

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('dashboard/', dashboard, name='dashboard_page'),
    path('template/', template_view, name='template_page')
]
