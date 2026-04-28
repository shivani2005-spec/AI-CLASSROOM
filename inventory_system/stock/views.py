from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Count, Sum, F
from django.utils import timezone
from datetime import timedelta
import json

from .models import Category, Product, StockTransaction


def dashboard(request):
    total_products = Product.objects.count()
    total_categories = Category.objects.count()
    low_stock_count = Product.objects.filter(stock_quantity__lte=models.F('minimum_stock_level')).count()
    recent_transactions_count = StockTransaction.objects.filter(
        date__gte=timezone.now() - timedelta(days=7)
    ).count()

    categories = Category.objects.annotate(
        product_count=Count('products')
    ).filter(product_count__gt=0)

    category_labels = list(categories.values_list('name', flat=True))
    category_data = list(categories.annotate(
        total_stock=Sum('products__stock_quantity')
    ).values_list('total_stock', flat=True))

    transaction_dates = []
    transaction_ins = []
    transaction_outs = []

    for i in range(6, -1, -1):
        date = timezone.now() - timedelta(days=i)
        day_start = date.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        transaction_dates.append(date.strftime('%a'))

        ins = StockTransaction.objects.filter(
            transaction_type='IN',
            date__gte=day_start,
            date__lt=day_end
        ).aggregate(total=Sum('quantity'))['total'] or 0

        outs = StockTransaction.objects.filter(
            transaction_type='OUT',
            date__gte=day_start,
            date__lt=day_end
        ).aggregate(total=Sum('quantity'))['total'] or 0

        transaction_ins.append(ins)
        transaction_outs.append(outs)

    return render(request, 'inventory/dashboard.html', {
        'active_page': 'dashboard',
        'total_products': total_products,
        'total_categories': total_categories,
        'low_stock_count': low_stock_count,
        'recent_transactions_count': recent_transactions_count,
        'category_labels': json.dumps(list(category_labels)),
        'category_data': json.dumps(list(category_data)),
        'transaction_dates': json.dumps(transaction_dates),
        'transaction_ins': json.dumps(transaction_ins),
        'transaction_outs': json.dumps(transaction_outs),
    })


def product_list(request):
    products = Product.objects.select_related('category').all()

    search = request.GET.get('search')
    if search:
        products = products.filter(name__icontains=search) | products.filter(sku__icontains=search)

    category_id = request.GET.get('category')
    if category_id:
        products = products.filter(category_id=category_id)

    categories = Category.objects.all()
    products = products.order_by('-created_at')

    return render(request, 'inventory/product_list.html', {
        'active_page': 'products',
        'products': products,
        'categories': categories,
    })


def product_create(request):
    categories = Category.objects.all()

    if request.method == 'POST':
        name = request.POST.get('name')
        sku = request.POST.get('sku')
        category_id = request.POST.get('category')
        price = request.POST.get('price')
        stock_quantity = request.POST.get('stock_quantity', 0)
        minimum_stock_level = request.POST.get('minimum_stock_level', 10)
        image = request.FILES.get('image')

        if Product.objects.filter(sku=sku).exists():
            messages.error(request, 'A product with this SKU already exists.')
            return render(request, 'inventory/product_form.html', {
                'active_page': 'products',
                'categories': categories,
                'form': request.POST,
            })

        product = Product.objects.create(
            name=name,
            sku=sku,
            category_id=category_id if category_id else None,
            price=price,
            stock_quantity=stock_quantity,
            minimum_stock_level=minimum_stock_level,
            image=image,
        )

        messages.success(request, f'Product "{product.name}" created successfully.')
        return redirect('product_list')

    return render(request, 'inventory/product_form.html', {
        'active_page': 'products',
        'categories': categories,
    })


def product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk)
    categories = Category.objects.all()

    if request.method == 'POST':
        product.name = request.POST.get('name')
        product.sku = request.POST.get('sku')
        product.category_id = request.POST.get('category') or None
        product.price = request.POST.get('price')
        product.stock_quantity = request.POST.get('stock_quantity', 0)
        product.minimum_stock_level = request.POST.get('minimum_stock_level', 10)

        if request.FILES.get('image'):
            product.image = request.FILES.get('image')

        product.save()
        messages.success(request, f'Product "{product.name}" updated successfully.')
        return redirect('product_list')

    return render(request, 'inventory/product_form.html', {
        'active_page': 'products',
        'categories': categories,
        'object': product,
    })


def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product.delete()
    messages.success(request, f'Product "{product.name}" deleted successfully.')
    return redirect('product_list')


def category_list(request):
    categories = Category.objects.all().order_by('-created_at')

    return render(request, 'inventory/category_list.html', {
        'active_page': 'categories',
        'categories': categories,
    })


def category_create(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')

        if Category.objects.filter(name=name).exists():
            messages.error(request, 'A category with this name already exists.')
            return render(request, 'inventory/category_form.html', {
                'active_page': 'categories',
                'form': request.POST,
            })

        category = Category.objects.create(name=name, description=description)
        messages.success(request, f'Category "{category.name}" created successfully.')
        return redirect('category_list')

    return render(request, 'inventory/category_form.html', {
        'active_page': 'categories',
    })


def category_edit(request, pk):
    category = get_object_or_404(Category, pk=pk)

    if request.method == 'POST':
        category.name = request.POST.get('name')
        category.description = request.POST.get('description')
        category.save()
        messages.success(request, f'Category "{category.name}" updated successfully.')
        return redirect('category_list')

    return render(request, 'inventory/category_form.html', {
        'active_page': 'categories',
        'object': category,
    })


def category_delete(request, pk):
    category = get_object_or_404(Category, pk=pk)
    category.delete()
    messages.success(request, f'Category "{category.name}" deleted successfully.')
    return redirect('category_list')


def transaction_logs(request):
    transactions = StockTransaction.objects.select_related('product').all()

    product_id = request.GET.get('product')
    if product_id:
        transactions = transactions.filter(product_id=product_id)

    products = Product.objects.all().order_by('name')
    transactions = transactions.order_by('-date')[:50]

    return render(request, 'inventory/transaction_logs.html', {
        'active_page': 'transactions',
        'transactions': transactions,
        'products': products,
    })


def transaction_create(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        transaction_type = request.POST.get('transaction_type')
        quantity = int(request.POST.get('quantity', 0))
        notes = request.POST.get('notes', '')

        product = get_object_or_404(Product, pk=product_id)

        if transaction_type == 'OUT' and quantity > product.stock_quantity:
            messages.error(request, 'Cannot remove more stock than available.')
            return redirect('product_list')

        transaction = StockTransaction.objects.create(
            product=product,
            transaction_type=transaction_type,
            quantity=quantity,
            notes=notes,
        )

        messages.success(request, f'Stock {"added" if transaction_type == "IN" else "removed"} for "{product.name}".')
        return redirect('product_list')

    return redirect('product_list')