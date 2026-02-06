from rest_framework import serializers
from .models import HomeSection
from .models import AboutSection
from rest_framework import serializers
from .models import ContactInfo, CompanyPolicy, ContactSubmission
from .models import Review
from .models import (
    category,
    product,
    ProductImage,
    Banner,
    Cart,
    CartItem,
    Order,
    OrderItem,
)

# contact 
class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = "__all__"


class CompanyPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPolicy
        fields = "__all__"


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = "__all__"
        

# ratings
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["is_approved", "created_at"]

# about page 

class AboutSectionSerializer(serializers.ModelSerializer):
    background_image = serializers.ImageField(use_url=True)

    class Meta:
        model = AboutSection
        fields = "__all__"

# cms 
class HomeSectionSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = HomeSection
        fields = "__all__"



# ---------------- CATEGORY ----------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = "__all__"


# ---------------- PRODUCT IMAGE ----------------
class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ProductImage
        fields = ["id", "image"]


# ---------------- PRODUCT ----------------
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = product
        fields = "__all__"


# ---------------- BANNER ----------------
class BannerSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    product_id = serializers.IntegerField(
        source="product.id",
        read_only=True
    )

    class Meta:
        model = Banner
        fields = [
            "id",
            "title",
            "subtitle",
            "image",
            "button_text",
            "button_link",
            "product_id",
            "is_active",
            "order",
        ]


# ---------------- CART ITEM ----------------
class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )
    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_image = serializers.ImageField(
        source="product.image",
        read_only=True
    )
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image",
            "quantity",
            "subtotal",
        ]


# ---------------- CART ----------------
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "user",
            "items",
            "total_items",
            "total_price",
            "created_at",
        ]


# ---------------- ORDER ITEM ----------------
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "price",
        ]


# ---------------- ORDER ----------------
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "total_amount",
            "created_at",
            "items",
        ]
