from django.urls import path
from . import views
from .views import banner_list, home_sections, about_section
from .views import get_products_by_category
from .views import submit_review, approved_reviews
from .views import register_user, login_user, protected_view
from .views import verify_payment
from .views import (
    get_contact_info,
    get_company_policies,
    submit_contact_form,
    submit_product_review,
    approved_product_reviews,
    product_questions,
    submit_product_question,     
)


urlpatterns = [
     path("products/", views.get_products),
    path("products/<int:pk>/", views.get_product),
    path("products/category/<slug:slug>/", views.get_products_by_category),
    path("products/<int:product_id>/reviews/", approved_product_reviews),
    path("reviews/submit/", submit_product_review),
    path("products/<int:product_id>/questions/", product_questions),
    path("questions/submit/", submit_product_question),
    path("categories/", views.get_Categories),
    path("cart/", views.get_Cart),
    path("cart/add/", views.add_to_Cart),
    path("cart/update/", views.update_cart_quantity),
    path("cart/remove/", views.remove_from_Cart),
    path("orders/create/", views.create_order),
    path("orders/my/", views.my_orders),   
    path("payment/create/", views.create_payment),  
    path("payment/verify/", verify_payment),
    path("auth/register/", views.register_user),
    path("auth/login/", views.login_user),
    path("auth/protected/", views.protected_view),
    path("banners/", views.banner_list),
    path("home/sections/", views.home_sections),
    path("about/section/", views.about_section),
    path("contact/info/", views.get_contact_info),
    path("contact/policies/", views.get_company_policies),
    path("contact/submit/", views.submit_contact_form),
    path("reviews/submit/", views.submit_review),
    path("reviews/approved/", views.approved_reviews),
     path("products/new-arrival/", views.new_arrival_products),
    path("products/best-seller/", views.best_seller_products),
]
