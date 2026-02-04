from django.contrib import admin
from django.utils.html import format_html
from .models import Banner

from .models import (
    category,
    product,
    ProductImage,
    UserProfile,
    Order,
    OrderItem
)

# ---------------- CATEGORY ----------------
@admin.register(category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


# ---------------- PRODUCT IMAGES INLINE ----------------
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3  # number of empty image upload fields
    readonly_fields = ("preview",)

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="80" height="60" style="object-fit:cover;border-radius:6px;" />',
                obj.image.url
            )
        return "No Image"

    preview.short_description = "Preview"


# ---------------- PRODUCT ----------------
@admin.register(product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "category", "created_at")
    list_filter = ("category",)
    search_fields = ("name",)
    inlines = [ProductImageInline]


# ---------------- USER PROFILE ----------------
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone_number")


# ---------------- ORDER ----------------
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_amount", "created_at")
    date_hierarchy = "created_at"


# ---------------- ORDER ITEM ----------------
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "product", "quantity", "price")

# banner
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "order")
    list_editable = ("is_active", "order")
    search_fields = ("title",)