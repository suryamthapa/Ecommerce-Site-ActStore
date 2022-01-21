from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
# IsAuthenticated checks whether the user is authenticated or not
# IsAdminUser checks whether the user is staff or not.
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer
from base.products import products

from rest_framework import serializers, status

import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems)==0:
        return Response({'detail':'No order Items'}, status= status.HTTP_400_BAD_REQUEST)
    else:
        # (1) Create order
        
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice']
        )
        # (2) Create shipping address
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country']
        )
        # (3) Create order items and set the order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product']) # product is the id value
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url
            )
            # (4) Update stock
            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(_id=pk)
        # Note: There are two types of users who want to see orders
        # (1) General users, who want to see their orders
        # (2) Admin users who want to verify orders
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            # If someone sends the request with wrong id or the other Orders ids which are not theirs.
            return Response({'detail':'Not authorized to view this order'},
                status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail':'Order does not exists.'},
            status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):

    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.datetime.now()

    order.save()

    return Response('Order was paid')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):

    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt = datetime.datetime.now()

    order.save()

    return Response('Order was delivered.')


