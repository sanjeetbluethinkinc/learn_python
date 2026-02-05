from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework import status
from .models import Banner
from .serializers import BannerSerializer
from .models import HomeSection
from .serializers import HomeSectionSerializer
from .models import AboutSection
from .serializers import AboutSectionSerializer


# about page 
@api_view(["GET"])
def about_section(request):
    section = AboutSection.objects.filter(is_active=True).first()
    if not section:
        return Response({})
    serializer = AboutSectionSerializer(section)
    return Response(serializer.data)

# cms 
@api_view(["GET"])
def home_sections(request):
    sections = HomeSection.objects.filter(is_active=True)
    serializer = HomeSectionSerializer(sections, many=True)
    return Response(serializer.data)


# banner
@api_view(["GET"])
def banner_list(request):
    banners = Banner.objects.filter(is_active=True)
    serializer = BannerSerializer(banners, many=True)
    return Response(serializer.data)


from .models import product, category, Cart, CartItem
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CartItemSerializer
)

# ---------------- PRODUCTS LIST ----------------
@api_view(['GET'])
def get_Products(request):
    products = product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# ---------------- PRODUCT DETAILS ----------------
@api_view(['GET'])
def get_Product(request, pk):
    single_product = get_object_or_404(product, id=pk)
    serializer = ProductSerializer(single_product)
    return Response(serializer.data)


# ---------------- CATEGORIES LIST ----------------
@api_view(['GET'])
def get_Categories(request):
    categories = category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


# ---------------- GET CART ----------------
@api_view(['GET'])
def get_Cart(request):
    cart, _ = Cart.objects.get_or_create(user=None)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


# ---------------- ADD TO CART ----------------
@api_view(['POST'])
def add_to_Cart(request):
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity", 1)

    if product_id is None:
        return Response(
            {"error": "product_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        quantity = int(quantity)
        if quantity <= 0:
            raise ValueError
    except ValueError:
        return Response(
            {"error": "quantity must be a positive integer"},
            status=status.HTTP_400_BAD_REQUEST
        )

    product_obj = get_object_or_404(product, id=product_id)
    cart, _ = Cart.objects.get_or_create(user=None)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product_obj,
        defaults={"quantity": quantity}
    )

    if not created:
        item.quantity += quantity
        item.save()

    return Response(
        {
            "message": "Product added to cart",
            "cart": CartSerializer(cart).data
        }
    )


# ---------------- UPDATE CART QUANTITY ----------------
@api_view(['POST'])
def update_cart_quantity(request):
    item_id = request.data.get("item_id")
    quantity = request.data.get("quantity")

    if item_id is None or quantity is None:
        return Response(
            {"error": "item_id and quantity are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        quantity = int(quantity)
    except ValueError:
        return Response(
            {"error": "quantity must be a number"},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart, _ = Cart.objects.get_or_create(user=None)

    try:
        item = CartItem.objects.get(id=item_id, cart=cart)

        if quantity <= 0:
            item.delete()
            return Response({"message": "Item removed from cart"})

        item.quantity = quantity
        item.save()

        serializer = CartItemSerializer(item)
        return Response(serializer.data)

    except CartItem.DoesNotExist:
        return Response(
            {"error": "CartItem not found"},
            status=status.HTTP_404_NOT_FOUND
        )


# ---------------- REMOVE FROM CART ----------------
@api_view(['POST'])
def remove_from_Cart(request):
    item_id = request.data.get("item_id")

    if item_id is None:
        return Response(
            {"error": "item_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart, _ = Cart.objects.get_or_create(user=None)
    deleted, _ = CartItem.objects.filter(id=item_id, cart=cart).delete()

    if deleted == 0:
        return Response(
            {"error": "CartItem not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({"message": "Product removed from cart"})
