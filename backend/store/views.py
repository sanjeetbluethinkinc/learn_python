from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Order, OrderItem
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Banner,
    HomeSection,
    AboutSection,
    Review,
    ContactInfo,
    CompanyPolicy,
    product,
    category,
    Cart,
    CartItem
)

from .serializers import (
    BannerSerializer,
    HomeSectionSerializer,
    AboutSectionSerializer,
    ReviewSerializer,
    ContactInfoSerializer,
    CompanyPolicySerializer,
    ContactSubmissionSerializer,
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CartItemSerializer,
)


from .serializers import OrderSerializer
from django.db import transaction
from .models import Order, OrderItem, OrderAddress, Cart

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).order_by("-created_at")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data
    user = request.user

    order = Order.objects.create(
        user=user,
        subtotal=data["subtotal"],
        shipping_fee=data["shipping_fee"],   # ✅ FIXED
        total_amount=data["total_amount"],   # ✅ FIXED
    )

    for item in data["items"]:
        OrderItem.objects.create(
            order=order,
            product_id=item["product"],
            quantity=item["quantity"],
            price=item["price"],
        )

    OrderAddress.objects.create(
        order=order,
        full_name=data["address"]["full_name"],
        phone=data["address"]["phone"],
        street=data["address"]["street"],
        city=data["address"]["city"],
        state=data["address"]["state"],
        zip_code=data["address"]["zip_code"],
    )

    return Response({"success": True}, status=201)


    # 3️⃣ CREATE ORDER ITEMS + STOCK CHECK
    for item in cart.items.all():
        product = item.product

        if product.quantity < item.quantity:
            return Response(
                {"error": f"{product.name} is out of stock"},
                status=status.HTTP_400_BAD_REQUEST
            )

        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=item.quantity,
            price=product.price,
        )

        product.quantity -= item.quantity
        product.save()

    # 4️⃣ CLEAR CART
    cart.items.all().delete()

    return Response(
        {
            "message": "Order placed successfully",
            "order_id": order.id
        },
        status=status.HTTP_201_CREATED
    )

# =========================
# AUTH
# =========================

@api_view(["POST"])
def register_user(request):
    email = request.data.get("email")
    password = request.data.get("password")
    name = request.data.get("name")

    if not email or not password or not name:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=email).exists():
        return Response(
            {"error": "User already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name,
    )

    return Response(
        {"message": "User registered successfully"},
        status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=email, password=password)

    if not user:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "name": user.first_name,
            "email": user.email,
        }
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You are logged in"})


# =========================
# CONTACT
# =========================

@api_view(["GET"])
def get_contact_info(request):
    contact = ContactInfo.objects.first()
    serializer = ContactInfoSerializer(contact)
    return Response(serializer.data)


@api_view(["GET"])
def get_company_policies(request):
    policies = CompanyPolicy.objects.filter(is_active=True)
    serializer = CompanyPolicySerializer(policies, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def submit_contact_form(request):
    serializer = ContactSubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Form submitted successfully"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# REVIEWS
# =========================

@api_view(["POST"])
def submit_review(request):
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Review submitted for admin approval"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def approved_reviews(request):
    reviews = Review.objects.filter(is_approved=True).order_by("-created_at")
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


# =========================
# CMS / STATIC
# =========================

@api_view(["GET"])
def home_sections(request):
    sections = HomeSection.objects.all().order_by("order")
    serializer = HomeSectionSerializer(
        sections, many=True, context={"request": request}
    )
    return Response(serializer.data)


@api_view(["GET"])
def banner_list(request):
    banners = Banner.objects.filter(is_active=True)
    serializer = BannerSerializer(banners, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def about_section(request):
    section = AboutSection.objects.filter(is_active=True).first()
    if not section:
        return Response({})
    serializer = AboutSectionSerializer(section)
    return Response(serializer.data)


# =========================
# PRODUCTS & CATEGORIES
# =========================

@api_view(["GET"])
def get_Products(request):
    products = product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_Product(request, pk):
    single_product = get_object_or_404(product, id=pk)
    serializer = ProductSerializer(single_product)
    return Response(serializer.data)


@api_view(["GET"])
def get_Categories(request):
    categories = category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_products_by_category(request, slug):
    category_obj = get_object_or_404(category, slug=slug)
    products = product.objects.filter(category=category_obj)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# =========================
# CART (GUEST CART)
# =========================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_Cart(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_Cart(request):
    user = request.user
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))

    if not product_id:
        return Response(
            {"error": "product_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    product_obj = get_object_or_404(product, id=product_id)

    # 🔥 BLOCK OUT OF STOCK
    if product_obj.quantity <= 0:
        return Response(
            {"error": "Product is out of stock"},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart, _ = Cart.objects.get_or_create(user=user)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product_obj,
        defaults={"quantity": quantity}
    )

    if not created:
        if item.quantity + quantity > product_obj.quantity:
            return Response(
                {"error": "Not enough stock available"},
                status=status.HTTP_400_BAD_REQUEST
            )
        item.quantity += quantity
        item.save()

    return Response({
        "message": "Product added to cart",
        "cart": CartSerializer(cart).data
    })


@api_view(["POST"])
def update_cart_quantity(request):
    item_id = request.data.get("item_id")
    quantity = request.data.get("quantity")

    if item_id is None or quantity is None:
        return Response(
            {"error": "item_id and quantity required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart, _ = Cart.objects.get_or_create(user=None)
    item = get_object_or_404(CartItem, id=item_id, cart=cart)

    quantity = int(quantity)

    # 🔥 CHECK STOCK
    if quantity > item.product.quantity:
        return Response(
            {"error": "Requested quantity exceeds available stock"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if quantity <= 0:
        item.delete()
        return Response({"message": "Item removed"})

    item.quantity = quantity
    item.save()

    return Response(CartItemSerializer(item).data)


@api_view(["POST"])
def remove_from_Cart(request):
    item_id = request.data.get("item_id")

    if not item_id:
        return Response(
            {"error": "item_id required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart, _ = Cart.objects.get_or_create(user=None)
    deleted, _ = CartItem.objects.filter(id=item_id, cart=cart).delete()

    if not deleted:
        return Response(
            {"error": "Item not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({"message": "Product removed from cart"})
