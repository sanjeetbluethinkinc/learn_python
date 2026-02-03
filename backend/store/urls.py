from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.get_Products),
    path('products/<int:pk>/', views.get_Product),
    path('categories/', views.get_Categories),
    path('cart/', views.get_Cart),
    path('cart/add/', views.add_to_Cart),
    path('cart/update/', views.update_cart_quantity),
    path('cart/remove/', views.remove_from_Cart),
]
