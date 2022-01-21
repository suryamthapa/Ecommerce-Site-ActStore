from django.core import paginator
from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
# IsAuthenticated checks whether the user is authenticated or not
# IsAdminUser checks whether the user is staff or not.
from rest_framework.response import Response

from base.models import Product, Review
from base.serializers import ProductSerializer
from base.products import products
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework import status


@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query is None:
        query = ''
    products = Product.objects.filter(name__icontains=query)

    page = request.query_params.get('page')
    paginator = Paginator(products, 8)

    try:
        products = paginator.page(page)
    except PageNotAnInteger: 
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page is None:
        page=1
    page = int(page)

    serializer = ProductSerializer(products, many=True) # It will return the serializer object
    # many=true means that we will be serializing many objects, for single objects it needs to be set False
    return Response({'products':serializer.data, 'page':page, 'pages':paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True) # It will return the serializer object
    
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request,pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    # for p in products:
    #     if p['_id'] == pk:
    #         product = p
    # product = [p if pk==p["_id"] else None for p in products][0] 
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product = Product.objects.get(_id=pk)
    product.delete()

    return Response('Product Deleted')

@api_view(['POST'])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()
    return Response('Image uploaded.')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    data = request.data

    product = Product.objects.get(_id=pk)

    # 1. Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content ={
            'detail':'Product already reviewed!'
        }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    
    # 2. No rating or 0 rating
    elif data['rating'] == 0:
        content ={
            'detail':'Please select a rating!'
        }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    
    # 3. Creating review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        
        total = 0
        for i in reviews:
            total += i.rating
        product.rating = total/len(reviews)
        product.save()
        content ={
            'detail':'Review added!'
        }
        return Response(content, status=status.HTTP_200_OK)