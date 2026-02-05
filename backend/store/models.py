from django.db import models
from django.contrib.auth.models import User


# ---------------- CATEGORY ----------------
class category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


# ---------------- PRODUCT ----------------
class product(models.Model):
    category = models.ForeignKey(
        category,
        related_name="products",
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    image = models.ImageField(
        upload_to="products/main/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ---------------- PRODUCT IMAGES ----------------
class ProductImage(models.Model):
    product = models.ForeignKey(
        product,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="products/gallery/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.name}"


# ---------------- BANNER (ADMIN CONTROLLED) ----------------
class Banner(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)

    image = models.ImageField(upload_to="banners/")

    # CTA button (admin controlled)
    button_text = models.CharField(
        max_length=50,
        default="Learn More",
        blank=True
    )
    button_link = models.URLField(
        blank=True,
        help_text="Full URL or frontend route"
    )

    # Optional product linking (SAFE string reference)
    product = models.ForeignKey(
        "product",
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


# ---------------- USER PROFILE ----------------
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username


# ---------------- CART ----------------
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


# ---------------- CART ITEM ----------------
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


# ---------------- ORDER ----------------
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.id}"


# ---------------- ORDER ITEM ----------------
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


class HomeSection(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)

    description = models.TextField()

    image = models.ImageField(upload_to="home_sections/")

    button_text = models.CharField(
        max_length=50,
        blank=True,
        default="Learn More"
    )
    button_link = models.CharField(
        max_length=255,
        blank=True,
        help_text="Frontend route or full URL"
    )

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title
    
#    about 
class AboutSection(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    background_image = models.ImageField(upload_to="about/")

    # Right side checklist (4 points like image)
    point_1 = models.CharField(max_length=200)
    point_2 = models.CharField(max_length=200)
    point_3 = models.CharField(max_length=200)
    point_4 = models.CharField(max_length=200)

    # Bottom story section
    story_label = models.CharField(
        max_length=100,
        default="OUR STORY"
    )
    story_title = models.CharField(max_length=200)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title