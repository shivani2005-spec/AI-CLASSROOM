from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']


class Product(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    stock_quantity = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    minimum_stock_level = models.PositiveIntegerField(default=10, validators=[MinValueValidator(0)])
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.minimum_stock_level

    class Meta:
        ordering = ['name']


class StockTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('IN', 'Stock In'),
        ('OUT', 'Stock Out'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions')
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    transaction_type = models.CharField(max_length=3, choices=TRANSACTION_TYPES)
    date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.product.name} - {self.get_transaction_type_display()} ({self.quantity})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.transaction_type == 'IN':
            self.product.stock_quantity += self.quantity
        elif self.transaction_type == 'OUT':
            self.product.stock_quantity = max(0, self.product.stock_quantity - self.quantity)
        self.product.save()

    class Meta:
        ordering = ['-date']