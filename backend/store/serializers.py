from rest_framework import serializers
from .models import category, product, Cart, CartItem, ProductImage


# ---------------- CATEGORY SERIALIZER ----------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = '__all__'


# ---------------- PRODUCT IMAGE SERIALIZER (NEW) ----------------
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image']


# ---------------- PRODUCT SERIALIZER (UPDATED) ----------------
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    # 🔥 ADD THIS LINE
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = product
        fields = '__all__'


# ---------------- CART ITEM SERIALIZER ----------------
class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )
    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_image = serializers.ImageField(
        source='product.image',
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = '__all__'


# ---------------- CART SERIALIZER ----------------
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = '__all__'
