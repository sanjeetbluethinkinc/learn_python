from django.contrib import admin
from .models import (
    Review,
    HomeSection,
    category,
    product,
    ProductImage,
    Banner,
    UserProfile,
    Cart,
    CartItem,
    Order,
    OrderItem,
    AboutSection,
)

from .models import ContactInfo, CompanyPolicy, ContactSubmission


# ==========================
# CONTACT INFO ADMIN
# ==========================
@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ("email", "phone")


# ==========================
# COMPANY POLICIES ADMIN
# ==========================
@admin.register(CompanyPolicy)
class CompanyPolicyAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_filter = ("is_active",)


# ==========================
# CONTACT FORM SUBMISSIONS ADMIN
# ==========================
@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "gender", "submitted_at")
    search_fields = ("name", "email", "phone")
    readonly_fields = ("submitted_at",)


# =======================
# REVIEW ADMIN (APPROVE / REJECT)
# =======================
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("name", "rating", "short_review", "is_approved", "created_at")
    list_filter = ("is_approved", "rating", "created_at")
    search_fields = ("name", "review")
    ordering = ("-created_at",)
    actions = ["approve_reviews", "reject_reviews"]

    def short_review(self, obj):
        return obj.review[:40] + "..." if len(obj.review) > 40 else obj.review

    short_review.short_description = "Review"

    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)

    approve_reviews.short_description = "Approve selected reviews"

    def reject_reviews(self, request, queryset):
        queryset.update(is_approved=False)

    reject_reviews.short_description = "Reject selected reviews"


# =======================
# HOME SECTION
# =======================
@admin.register(HomeSection)
class HomeSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "subtitle", "order")
    ordering = ("order",)


# =======================
# CATEGORY
# =======================
@admin.register(category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


# =======================
# PRODUCT + IMAGES
# =======================
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "created_at")
    list_filter = ("category",)
    search_fields = ("name",)
    inlines = [ProductImageInline]


# =======================
# BANNER
# =======================
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "order")
    list_filter = ("is_active",)
    ordering = ("order",)


# =======================
# USER PROFILE
# =======================
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone_number")


# =======================
# CART
# =======================
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    inlines = [CartItemInline]


# =======================
# ORDER
# =======================
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_amount", "created_at")
    inlines = [OrderItemInline]


# =======================
# ABOUT SECTION
# =======================
@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_filter = ("is_active",)
