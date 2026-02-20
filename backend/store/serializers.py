from rest_framework import serializers

from .models import HomeSection, AboutSection
from .models import ContactInfo, CompanyPolicy, ContactSubmission
from .models import Review
from .models import OrderAddress, ProductQuestion, ProductReview
from .models import (
    category,
    product,
    productImage,
    Banner,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
)
class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = "__all__"
        read_only_fields = ("is_approved", "created_at")


class ProductQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductQuestion
        fields = "__all__"
        read_only_fields = ("answer", "is_answered", "created_at")


# ---------------- ORDER ADDRESS ----------------
class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderAddress
        fields = [
            "full_name",
            "phone",
            "street",
            "city",
            "state",
            "zip_code",
        ]

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"

# ---------------- CONTACT ----------------
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


# ---------------- REVIEWS ----------------
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ["is_approved", "created_at"]


# ---------------- ABOUT PAGE ----------------
class AboutSectionSerializer(serializers.ModelSerializer):
    background_image = serializers.ImageField(use_url=True)

    class Meta:
        model = AboutSection
        fields = "__all__"


# ---------------- CMS ----------------
class HomeSectionSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = HomeSection
        fields = "__all__"


# ---------------- category ----------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = "__all__"


# ---------------- product IMAGE ----------------
class productImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(
    use_url=True,
    required=False,
    allow_null=True
)

    class Meta:
        model = productImage
        fields = ["id", "image"]


# ---------------- product ----------------
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = productImageSerializer(many=True, read_only=True)
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = product
        fields = [
            "id",
            "category",
            "name",
            "sku",
            "description",
            "price",
            "image",
            "images",
            "quantity",
            "in_stock",
            "created_at",
        ]

    def get_in_stock(self, obj):
        return obj.quantity > 0


# ---------------- BANNER ----------------
class BannerSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    product_id = serializers.IntegerField(source="product.id", read_only=True)

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
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_sku = serializers.CharField(source="product.sku", read_only=True)
    product_image = serializers.ImageField(source="product.image", read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_sku",
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


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )
    product_sku = serializers.CharField(
        source="product.sku",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product_name",
            "product_sku",
            "quantity",
            "price",
        )


# ---------------- ORDER ITEM (WRITE) ----------------
class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product", "quantity", "price"]


# ---------------- ORDER CREATE (FIXED) ----------------
class OrderCreateSerializer(serializers.ModelSerializer):
    address = OrderAddressSerializer(write_only=True)
    items = OrderItemCreateSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            "subtotal",
            "shipping_fee",
            "total_amount",
            "address",
            "items",
        ]

def create(self, validated_data):
    request = self.context["request"]
    user = request.user

    address_data = validated_data.pop("address")
    items_data = validated_data.pop("items")

    # 1️⃣ Create Order FIRST
    order = Order.objects.create(
        user=user,
        **validated_data
    )

    # 2️⃣ Attach address to order
    OrderAddress.objects.create(
        order=order,
        **address_data
    )

    # 3️⃣ Create order items
    for item in items_data:
        product_obj = item["product"]

        if product_obj.quantity < item["quantity"]:
            raise serializers.ValidationError(
                f"Not enough stock for {product_obj.name}"
            )

        OrderItem.objects.create(
            order=order,
            product=product_obj,
            quantity=item["quantity"],
            price=item["price"],
        )

        product_obj.quantity -= item["quantity"]
        product_obj.save()

    return order



# ---------------- ORDER READ ----------------
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = OrderAddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "subtotal",
            "shipping_fee",
            "total_amount",
            "created_at",
            "items",
            "address",
        ]
