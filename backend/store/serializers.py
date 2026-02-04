from rest_framework import serializers
from .models import Banner
from .models import (
    category,
    product,
    Cart,
    CartItem,
    ProductImage,
    Banner,
)


# banner

class BannerSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Banner
        fields = "__all__"

# ---------------- CATEGORY SERIALIZER ----------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = "__all__"


# ---------------- PRODUCT IMAGE SERIALIZER ----------------
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]


# ---------------- PRODUCT SERIALIZER ----------------
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = product
        fields = "__all__"


# ---------------- BANNER SERIALIZER ----------------
class BannerSerializer(serializers.ModelSerializer):
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
            "product_id",
        ]


# ---------------- CART ITEM SERIALIZER ----------------
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

    class Meta:
        model = CartItem
        fields = "__all__"


# ---------------- CART SERIALIZER ----------------
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = "__all__"

