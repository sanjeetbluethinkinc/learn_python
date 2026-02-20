from django.contrib import admin
from .models import ProductReview, ProductQuestion
from .models import (
    product,
    Review,
    HomeSection,
    category,
    productImage,
    Banner,
    UserProfile,
    Cart,
    CartItem,
    Order,
    OrderItem,
    OrderAddress,
    Payment,
    AboutSection,
    ContactInfo,
    CompanyPolicy,
    ContactSubmission,
)

# ==========================
# PAYMENT ADMIN
# ==========================
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "payment_method",
        "amount",
        "status",
        "created_at",
    )
    list_filter = ("payment_method", "status")
    search_fields = ("payment_id", "order__id")


# ==========================
# CONTACT INFO
# ==========================
@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ("email", "phone")


# ==========================
# COMPANY POLICIES
# ==========================
@admin.register(CompanyPolicy)
class CompanyPolicyAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_filter = ("is_active",)


# ==========================
# CONTACT SUBMISSIONS
# ==========================
@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "gender", "submitted_at")
    search_fields = ("name", "email", "phone")
    readonly_fields = ("submitted_at",)


# ==========================
# REVIEWS
# ==========================
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("name", "rating", "short_review", "is_approved", "created_at")
    list_filter = ("is_approved", "rating", "created_at")
    search_fields = ("name", "review")
    ordering = ("-created_at",)
    actions = ["approve_reviews", "reject_reviews"]

    def short_review(self, obj):
        return obj.review[:40] + "..." if len(obj.review) > 40 else obj.review


# ==========================
# HOME SECTION
# ==========================
@admin.register(HomeSection)
class HomeSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "subtitle", "order")
    ordering = ("order",)


# ==========================
# CATEGORY
# ==========================
@admin.register(category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


# ==========================
# PRODUCT + IMAGES
# ==========================
class ProductImageInline(admin.TabularInline):
    model = productImage
    extra = 1


@admin.register(product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "sku",
        "category",
        "price",
        "quantity",
        "is_best_seller",
        "is_new_arrival",
        "is_in_stock",
        "created_at",
    )

    list_editable = (
        "price",
        "quantity",
        "is_best_seller",
        "is_new_arrival",
    )

    list_filter = (
        "category",
        "is_best_seller",
        "is_new_arrival",
        "quantity",
    )

    search_fields = ("name", "sku")

    fieldsets = (
        ("Basic Information", {
            "fields": (
                "category",
                "name",
                "sku",
                "price",
                "quantity",
                "image",
            )
        }),
        ("Product Flags (Homepage Sections)", {
            "fields": (
                "is_best_seller",
                "is_new_arrival",
            )
        }),
        ("Product Description (Frontend Tab)", {
            "fields": ("description",),
        }),
    )

    inlines = [ProductImageInline]

# ==========================
# BANNER
# ==========================
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "order")
    list_filter = ("is_active",)
    ordering = ("order",)


# ==========================
# USER PROFILE
# ==========================
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone_number")


# ==========================
# CART
# ==========================
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    inlines = [CartItemInline]


# ==========================
# ORDER SECTION
# ==========================
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False

    readonly_fields = (
        "product_name",
        "product_sku",
        "quantity",
        "price",
    )

    fields = (
        "product_name",
        "product_sku",
        "quantity",
        "price",
    )

    def product_name(self, obj):
        return obj.product.name if obj.product else "-"

    def product_sku(self, obj):
        return obj.product.sku if obj.product else "-"

    product_name.short_description = "Product"
    product_sku.short_description = "SKU"



class OrderAddressInline(admin.StackedInline):
    model = OrderAddress
    extra = 0
    can_delete = False
    readonly_fields = (
        "full_name",
        "phone",
        "street",
        "city",
        "state",
        "zip_code",
    )
    verbose_name_plural = "Delivery Address"


class PaymentInline(admin.StackedInline):
    model = Payment
    extra = 0
    can_delete = False
    readonly_fields = (
        "payment_method",
        "payment_id",
        "amount",
        "status",
        "created_at",
    )
    verbose_name_plural = "Payment Details"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "total_amount",
        "payment_status",
        "is_paid",
        "created_at",
    )
    list_filter = ("payment_status", "is_paid", "created_at")
    search_fields = ("id", "user__username")
    ordering = ("-created_at",)

    inlines = [
        OrderAddressInline,
        OrderItemInline,
        PaymentInline,
    ]
    
# ==========================
# ABOUT SECTION
# ==========================
@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_filter = ("is_active",)

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "name", "rating", "is_approved", "created_at")
    list_filter = ("is_approved", "rating")
    actions = ["approve_reviews"]

    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)

@admin.register(ProductQuestion)
class ProductQuestionAdmin(admin.ModelAdmin):
    list_display = ("product", "name", "is_answered", "created_at")
    list_filter = ("is_answered",)
    fields = ("product", "name", "question", "answer", "is_answered")
