from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import razorpay
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Banner,
    HomeSection,
    AboutSection,
    Review,
    ContactInfo,
    CompanyPolicy,
    category,
    product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    OrderAddress,
    Payment,
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
    OrderSerializer,
    ProductQuestion,
    ProductReviewSerializer,
    ProductReview,
    ProductQuestionSerializer,
)


@api_view(["GET"])
def approved_product_reviews(request, product_id):
    reviews = ProductReview.objects.filter(
        product_id=product_id,
        is_approved=True
    )
    serializer = ProductReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def submit_product_review(request):
    serializer = ProductReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Review submitted for admin approval"},
            status=201
        )
    return Response(serializer.errors, status=400)
@api_view(["GET"])
def product_questions(request, product_id):
    questions = ProductQuestion.objects.filter(
        product_id=product_id,
        is_answered=True
    )
    serializer = ProductQuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def submit_product_question(request):
    serializer = ProductQuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Question submitted to admin"},
            status=201
        )
    return Response(serializer.errors, status=400)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    try:
        order_id = request.data.get("order_id")
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        if not all([order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response(
                {"error": "Missing payment details"},
                status=400
            )

        # 🔐 Initialize Razorpay client
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        # 🔐 Verify Signature
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature,
        })

        # ✅ Update Order
        order = Order.objects.get(id=order_id, user=request.user)

        order.payment_status = "SUCCESS"
        order.is_paid = True
        order.status = "CONFIRMED"
        order.save()

        # ✅ Update Payment record
        payment = Payment.objects.get(order=order)
        payment.status = "SUCCESS"
        payment.save()

        return Response({"message": "Payment verified successfully"})

    except razorpay.errors.SignatureVerificationError:
        return Response(
            {"error": "Invalid payment signature"},
            status=400
        )

    except Order.DoesNotExist:
        return Response(
            {"error": "Order not found"},
            status=404
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=400
        )
# ======================================================
# CREATE ORDER (COD or ONLINE)
# ======================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user
    data = request.data

    try:
        with transaction.atomic():
            # 1️⃣ VALIDATE DATA
            items = data.get("items", [])
            address = data.get("address")
            payment_method = data.get("payment_method", "COD")

            if not items:
                return Response({"error": "No order items found"}, status=400)

            if not address:
                return Response({"error": "Address is required"}, status=400)

            # 2️⃣ CREATE ORDER (always PENDING initially)
            order = Order.objects.create(
                user=user,
                subtotal=data.get("subtotal", 0),
                shipping_fee=data.get("shipping_fee", 0),
                total_amount=data.get("total_amount", 0),
                status="PENDING",
                payment_status="PENDING",
                is_paid=False,
            )

            # 3️⃣ SAVE ADDRESS
            OrderAddress.objects.create(
                order=order,
                full_name=address.get("full_name"),
                phone=address.get("phone"),
                street=address.get("street"),
                city=address.get("city"),
                state=address.get("state"),
                zip_code=address.get("zip_code"),
            )

            # 4️⃣ CREATE ORDER ITEMS + REDUCE STOCK
            for item in items:
                product_obj = product   .objects.select_for_update().get(id=item["product"])

                if product_obj.quantity < item["quantity"]:
                    raise Exception(f"{product_obj.name} is out of stock")

                product_obj.quantity -= item["quantity"]
                product_obj.save()

                OrderItem.objects.create(
                    order=order,
                    product=product_obj,
                    quantity=item["quantity"],
                    price=item["price"],
                )

            # 5️⃣ CREATE PAYMENT RECORD
            payment = Payment.objects.create(
                user=user,
                order=order,
                payment_method=payment_method,
                amount=order.total_amount,
                status="PENDING",
            )

            # 6️⃣ COD FLOW
            if payment_method == "COD":
                order.status = "CONFIRMED"
                order.payment_status = "PENDING"
                order.is_paid = False
                order.save()

            return Response(
                {
                    "message": "Order created successfully",
                    "order_id": order.id,
                    "payment_method": payment_method,
                },
                status=201,
            )

    except Exception as e:
        return Response({"error": str(e)}, status=400)


# ======================================================
# CREATE RAZORPAY PAYMENT (ONLINE ONLY)
# ======================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment(request):
    order_id = request.data.get("order_id")

    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    if order.is_paid:
        return Response({"error": "Order already paid"}, status=400)

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    razorpay_order = client.order.create({
        "amount": int(order.total_amount * 100),  # rupees → paise
        "currency": "INR",
        "payment_capture": 1,
    })

    return Response({
        "razorpay_key": settings.RAZORPAY_KEY_ID,
        "razorpay_order_id": razorpay_order["id"],
        "amount": razorpay_order["amount"],
        "currency": "INR",
        "order_id": order.id,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).order_by("-created_at")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user
    data = request.data

    try:
        with transaction.atomic():
            items = data.get("items", [])
            address = data.get("address")
            payment_method = data.get("payment_method", "COD")

            if not items:
                return Response({"error": "No order items found"}, status=400)

            if not address:
                return Response({"error": "Address is required"}, status=400)

            order = Order.objects.create(
                user=user,
                subtotal=data.get("subtotal", 0),
                shipping_fee=data.get("shipping_fee", 0),
                total_amount=data.get("total_amount", 0),
                status="PENDING",
                payment_status="PENDING",
                is_paid=False,
            )

            OrderAddress.objects.create(
                order=order,
                full_name=address.get("full_name"),
                phone=address.get("phone"),
                street=address.get("street"),
                city=address.get("city"),
                state=address.get("state"),
                zip_code=address.get("zip_code"),
            )

            for item in items:
                product_id = item.get("product")
                quantity = item.get("quantity")

                if not product_id or not quantity:
                    return Response(
                        {"error": "Invalid order item"},
                        status=400
                    )

                product_obj = product.objects.select_for_update().get(
                    id=product_id
                )

                if product_obj.quantity < quantity:
                    return Response(
                        {"error": f"{product_obj.name} is out of stock"},
                        status=400
                    )

                product_obj.quantity -= quantity
                product_obj.save()

                OrderItem.objects.create(
                    order=order,
                    product=product_obj,
                    quantity=quantity,
                    price=item.get("price"),
                )

            Payment.objects.create(
                user=user,
                order=order,
                payment_method=payment_method,
                amount=order.total_amount,
                status="PENDING",
            )

            if payment_method == "COD":
                order.status = "CONFIRMED"
                order.save()

            return Response(
                {
                    "message": "Order created successfully",
                    "order_id": order.id,
                },
                status=201,
            )

    except Exception as e:
        return Response({"error": str(e)}, status=400)

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
# productS & CATEGORIES
# =========================
@api_view(["GET"])
def get_products(request):
    """
    /api/products/
    /api/products/?category=<slug>
    """
    category_slug = request.GET.get("category")

    products_qs = product.objects.all()

    if category_slug:
        products_qs = products_qs.filter(category__slug=category_slug)

    serializer = ProductSerializer(products_qs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_product(request, pk):
    single_product = get_object_or_404(product, id=pk)
    serializer = ProductSerializer(single_product) 
    return Response(serializer.data)
# =========================
# HOME PRODUCT SECTIONS
# =========================

@api_view(["GET"])
def new_arrival_products(request):
    products = product.objects.filter(is_new_arrival=True).order_by("-created_at")
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def best_seller_products(request):
    products = product.objects.filter(is_best_seller=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# =========================
# CATEGORIES
# =========================

@api_view(["GET"])
def get_Categories(request):
    categories = category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


# (OPTIONAL – keep only if you still use it somewhere)
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
            {"error": "product is out of stock"},
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
        "message": "product added to cart",
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

    return Response({"message": "product removed from cart"})
