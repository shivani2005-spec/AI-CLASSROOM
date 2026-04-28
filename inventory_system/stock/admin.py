from django.contrib import admin
from .models import Category, Product, StockTransaction


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'updated_at']
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'category', 'price', 'stock_quantity', 'minimum_stock_level']
    list_filter = ['category']
    search_fields = ['name', 'sku']


@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = ['product', 'quantity', 'transaction_type', 'date', 'notes']
    list_filter = ['transaction_type', 'date']
    search_fields = ['product__name']
    readonly_fields = ['date']