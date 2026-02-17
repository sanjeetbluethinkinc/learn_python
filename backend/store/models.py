from django.db import models
from django.contrib.auth.models import User
import uuid

# ==========================
# ORDER ADDRESS (CHECKOUT)
# ==========================
class OrderAddress(models.Model):
    order = models.OneToOneField(
        "Order",
        related_name="address",
        on_delete=models.CASCADE
    )
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    street = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)

    def __str__(self):
        return f"Address for Order {self.order.id}"


# ==========================
# CONTACT DETAILS (ADMIN)
# ==========================
class ContactInfo(models.Model):
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()

    def __str__(self):
        return "Contact Information"


# ==========================
# COMPANY POLICIES / DESCRIPTION
# ==========================
class CompanyPolicy(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


# ==========================
# CONTACT FORM SUBMISSIONS
# ==========================
class ContactSubmission(models.Model):
    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ==========================
# REVIEWS
# ==========================
class Review(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]

    name = models.CharField(max_length=100)
    rating = models.IntegerField(choices=RATING_CHOICES)
    review = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.rating}★"


# ==========================
# HOME CMS
# ==========================
class HomeSection(models.Model):
    subtitle = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to="home/")
    button_text = models.CharField(max_length=50, blank=True, null=True)
    button_link = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title


# ==========================
# category
# ==========================
class category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


# ==========================
# product
# ==========================
class product(models.Model):
    category = models.ForeignKey(
        category,
        related_name="products",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="products/main/", blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)

    # ✅ ADD THESE TWO FIELDS
    is_best_seller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = f"SKU-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)

    @property
    def is_in_stock(self):
        return self.quantity > 0

    def __str__(self):
        return f"{self.name} ({self.sku})"


# ==========================
# product GALLERY
# ==========================
class productImage(models.Model):
    product = models.ForeignKey(
        product,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="products/gallery/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.name}"


# ==========================
# BANNERS
# ==========================
class Banner(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)

    image = models.ImageField(upload_to="banners/")

    button_text = models.CharField(
        max_length=50,
        default="Learn More",
        blank=True
    )
    button_link = models.URLField(
        blank=True,
        help_text="Full URL or frontend route"
    )

    product = models.ForeignKey(
        product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="banners"
    )

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


# ==========================
# USER PROFILE
# ==========================
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username


# ==========================
# CART
# ==========================
class Cart(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.id}"

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())


# ==========================
# CART ITEM
# ==========================
class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        related_name="items",
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def subtotal(self):
        return self.quantity * self.product.price


# ==========================
# ORDER
# ==========================
class Order(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # 📦 ORDER STATUS (delivery lifecycle)
    status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending"),
            ("CONFIRMED", "Confirmed"),
            ("SHIPPED", "Shipped"),
            ("DELIVERED", "Delivered"),
            ("CANCELLED", "Cancelled"),
        ],
        default="PENDING",
    )

    # 💰 PAYMENT STATE
    is_paid = models.BooleanField(default=False)
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending"),
            ("SUCCESS", "Success"),
            ("FAILED", "Failed"),
        ],
        default="PENDING",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id}"
    
# ==========================
# ORDER ITEM
# ==========================
class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


# ==========================
# ABOUT PAGE CMS
# ==========================
class AboutSection(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    background_image = models.ImageField(upload_to="about/")

    point_1 = models.CharField(max_length=200)
    point_2 = models.CharField(max_length=200)
    point_3 = models.CharField(max_length=200)
    point_4 = models.CharField(max_length=200)

    story_label = models.CharField(
        max_length=100,
        default="OUR STORY"
    )
    story_title = models.CharField(max_length=200)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
# ==========================
# PRODUCT REVIEWS
# ==========================
class ProductReview(models.Model):
    product = models.ForeignKey(
        product,
        related_name="reviews",
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    review = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.rating}★"
# ==========================
# PRODUCT Q&A (DISCUSSION / FAQ)
# ==========================
class ProductQuestion(models.Model):
    product = models.ForeignKey(
        product,
        related_name="questions",
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    question = models.TextField()
    answer = models.TextField(blank=True)
    is_answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Q: {self.product.name}"




# payment
class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ("COD", "Cash On Delivery"),
        ("RAZORPAY", "Razorpay"),
        ("STRIPE", "Stripe"),
    )

    PAYMENT_STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payments",
    )

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="payment",
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
    )
    
    payment_id = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Gateway payment/order ID (Razorpay / Stripe)",
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="PENDING",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.order_id} | {self.payment_method} | {self.status}"