'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IOrder } from '@/lib/db/models/order.model'
import { cn, formatDateTime } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import ProductPrice from '../product/product-price'
import ActionButton from '../action-button'
import { deliverOrder, updateOrderToPaid } from '@/lib/actions/order.actions'
import { 
  Truck, 
  CreditCard, 
  Package, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  ShoppingCart
} from 'lucide-react'

export default function OrderDetailsForm({
  order,
  isAdmin,
}: {
  order: IOrder
  isAdmin: boolean
}) {
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    expectedDeliveryDate,
  } = order

  return (
    <div className='grid lg:grid-cols-3 gap-6'>
      <div className='lg:col-span-2 space-y-6'>
        {/* Shipping Address Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p className="text-muted-foreground">{shippingAddress.phone}</p>
              <p className="text-muted-foreground">
                {shippingAddress.street}, {shippingAddress.city},<br />
                {shippingAddress.province}, {shippingAddress.postalCode},<br />
                {shippingAddress.country}
              </p>
              
              <div className="pt-3 border-t">
                {isDelivered ? (
                  <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Delivered on {formatDateTime(deliveredAt!).dateTime}
                  </Badge>
                ) : (
                  <div className="space-y-2">
                    <Badge variant="outline" className="gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      In transit
                    </Badge>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Expected by {formatDateTime(expectedDeliveryDate!).dateTime}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="font-medium capitalize">{paymentMethod.toLowerCase()}</span>
              {isPaid ? (
                <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Paid on {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <XCircle className="h-3.5 w-3.5" />
                  Pending payment
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              Order Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors'
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className='font-medium'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className='px-2 font-medium'>{item.quantity}</span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <ProductPrice price={item.price} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Mobile view for order items */}
            <div className="md:hidden p-4 space-y-4">
              {items.map((item) => (
                <div key={item.slug} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className='flex items-center gap-3 flex-1'
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className='font-medium text-sm'>{item.name}</p>
                      <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                    </div>
                  </Link>
                  <div className="font-medium text-right">
                    <ProductPrice price={item.price * item.quantity} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Summary Card */}
      <div className="h-fit sticky top-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className='flex justify-between'>
                <div className="text-muted-foreground">Subtotal</div>
                <div><ProductPrice price={itemsPrice} plain /></div>
              </div>
              <div className='flex justify-between'>
                <div className="text-muted-foreground">Tax</div>
                <div><ProductPrice price={taxPrice} plain /></div>
              </div>
              <div className='flex justify-between'>
                <div className="text-muted-foreground">Shipping</div>
                <div><ProductPrice price={shippingPrice} plain /></div>
              </div>
              <div className='border-t pt-3 flex justify-between font-bold text-lg'>
                <div>Total</div>
                <div><ProductPrice price={totalPrice} plain /></div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              {!isPaid && ['Stripe', 'PayPal'].includes(paymentMethod) && (
                <Link
                  className={cn(buttonVariants(), 'w-full')}
                  href={`/checkout/${order._id}`}
                >
                  Pay Now
                </Link>
              )}

              {isAdmin && !isPaid && paymentMethod === 'Cash On Delivery' && (
                <ActionButton
                  caption='Mark as Paid'
                  action={() => updateOrderToPaid(order._id)}
                  className="w-full"
                />
              )}
              {isAdmin && isPaid && !isDelivered && (
                <ActionButton
                  caption='Mark as Delivered'
                  action={() => deliverOrder(order._id)}
                  className="w-full"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
