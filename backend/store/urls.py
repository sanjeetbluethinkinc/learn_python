from django.urls import path
from . import views
from .views import banner_list, home_sections, about_section
from .views import get_products_by_category
from .views import submit_review, approved_reviews
from .views import register_user, login_user, protected_view
from .views import (
    get_contact_info,
    get_company_policies,
    submit_contact_form,
)


urlpatterns = [
    path('products/', views.get_Products),
    path('products/<int:pk>/', views.get_Product),
    path('categories/', views.get_Categories),
    path('cart/', views.get_Cart),
    path('cart/add/', views.add_to_Cart),
    path('cart/update/', views.update_cart_quantity),
    path('cart/remove/', views.remove_from_Cart),
    path("banners/", banner_list),
    path("home/sections/", home_sections),
    path("about/section/", about_section),
    path("products/category/<slug:slug>/", get_products_by_category),
    path("reviews/submit/", submit_review, name="submit-review"),
    path("reviews/approved/", approved_reviews, name="approved-reviews"),
    path("contact/info/", get_contact_info),
    path("contact/policies/", get_company_policies),
    path("contact/submit/", submit_contact_form),
    path("auth/register/", register_user),
    path("auth/login/", login_user),
    path("auth/protected/", protected_view),
]
