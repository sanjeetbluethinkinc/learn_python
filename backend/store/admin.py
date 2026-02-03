from django.contrib import admin
from .models import category, product, UserProfile, Order, OrderItem

admin.site.register(category)
admin.site.register(product)
admin.site.register(UserProfile)
admin.site.register(Order)
admin.site.register(OrderItem)
