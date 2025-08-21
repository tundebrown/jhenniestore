'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { createOrder } from '@/lib/actions/order.actions'
import {
  calculateFutureDate,
  formatDateTime,
  timeUntilMidnight,
} from '@/lib/utils'
import { ShippingAddressSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import CheckoutFooter from './checkout-footer'
import { ShippingAddress } from '@/types'
import useIsMounted from '@/hooks/use-is-mounted'
import Link from 'next/link'
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import ProductPrice from '@/components/shared/product/product-price'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield, Truck, Lock, CreditCard, MapPin, Calendar, Package } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const shippingAddressDefaultValues = {
  fullName: '',
  street: '',
  city: '',
  province: '',
  phone: '',
  postalCode: '',
  country: '',
}

const CheckoutForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const {
    setting: {
      site,
      availablePaymentMethods,
      defaultPaymentMethod,
      availableDeliveryDates,
    },
  } = useSettingStore()

  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
      paymentMethod = defaultPaymentMethod,
    },
    setShippingAddress,
    setPaymentMethod,
    updateItem,
    removeItem,
    clearCart,
    setDeliveryDateIndex,
  } = useCartStore()
  const isMounted = useIsMounted()

  const shippingAddressForm = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddress || shippingAddressDefaultValues,
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = (values) => {
    setShippingAddress(values)
    setCurrentStep(2)
  }

  useEffect(() => {
    if (!isMounted || !shippingAddress) return
    Object.entries(shippingAddress).forEach(([key, value]) => {
      shippingAddressForm.setValue(key as keyof ShippingAddress, value)
    })
  }, [isMounted, shippingAddress, shippingAddressForm])

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    try {
      const res = await createOrder({
        items,
        shippingAddress,
        expectedDeliveryDate: calculateFutureDate(
          availableDeliveryDates[deliveryDateIndex!].daysToDeliver
        ),
        deliveryDateIndex,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
      
      if (!res.success) {
        toast({
          description: res.message,
          variant: 'destructive',
        })
      } else {
        toast({
          description: res.message,
          variant: 'default',
        })
        clearCart()
        router.push(`/checkout/${res.data?.orderId}`)
      }
    } catch (error) {
      toast({
        description: 'An error occurred while placing your order',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: 1, title: 'Shipping Address', icon: MapPin },
    { id: 2, title: 'Payment Method', icon: CreditCard },
    { id: 3, title: 'Review & Place Order', icon: Package },
  ]

  const CheckoutSummary = () => (
    <Card className="sticky top-6 border-0 shadow-lg">
      <CardHeader className="pb-4 border-b">
        <h3 className="text-lg font-semibold">Order Summary</h3>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Items ({items.length})</span>
            <ProductPrice price={itemsPrice} plain />
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className={shippingPrice === 0 ? 'text-green-600' : ''}>
              {shippingPrice === undefined ? '--' : shippingPrice === 0 ? 'FREE' : (
                <ProductPrice price={shippingPrice} plain />
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>
              {taxPrice === undefined ? '--' : (
                <ProductPrice price={taxPrice} plain />
              )}
            </span>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <ProductPrice price={totalPrice} plain />
        </div>

        {currentStep === 3 && (
          <Button 
            onClick={handlePlaceOrder} 
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin mr-2">⏳</div>
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Place Your Order
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Shipping Address</h2>
                      <p className="text-gray-600 text-sm">Where should we deliver your order?</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...shippingAddressForm}>
                    <form onSubmit={shippingAddressForm.handleSubmit(onSubmitShippingAddress)} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={shippingAddressForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingAddressForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={shippingAddressForm.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={shippingAddressForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingAddressForm.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Province *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter province" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={shippingAddressForm.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter postal code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingAddressForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={shippingAddressForm.handleSubmit(onSubmitShippingAddress)}
                    className="w-full"
                    size="lg"
                  >
                    Continue to Payment
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Payment Method</h2>
                      <p className="text-gray-600 text-sm">How would you like to pay?</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    {availablePaymentMethods.map((pm) => (
                      <Card
                        key={pm.name}
                        className={`cursor-pointer border-2 transition-all ${
                          paymentMethod === pm.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod(pm.name)}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <RadioGroupItem value={pm.name} id={`payment-${pm.name}`} />
                          <Label htmlFor={`payment-${pm.name}`} className="flex-1 cursor-pointer">
                            <div className="font-semibold">{pm.name}</div>
                            {/* {pm.description && (
                              <div className="text-sm text-gray-600">{pm.description}</div>
                            )} */}
                          </Label>
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1"
                    disabled={!paymentMethod}
                  >
                    Continue to Review
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Shipping Address Review */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold">Shipping Address</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                        Change
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {shippingAddress?.fullName}<br />
                      {shippingAddress?.street}<br />
                      {shippingAddress?.city}, {shippingAddress?.province}<br />
                      {shippingAddress?.postalCode}, {shippingAddress?.country}<br />
                      {shippingAddress?.phone}
                    </p>
                  </CardContent>
                </Card>

                {/* Payment Method Review */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold">Payment Method</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                        Change
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{paymentMethod}</p>
                  </CardContent>
                </Card>

                {/* Items Review */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold">Order Items</h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="relative w-16 h-16">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              {item.color} • {item.size} • Qty: {item.quantity}
                            </p>
                            <ProductPrice price={item.price * item.quantity} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Date */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">Delivery Information</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">
                          Expected Delivery: {formatDateTime(
                            calculateFutureDate(
                              availableDeliveryDates[deliveryDateIndex!].daysToDeliver
                            )
                          ).dateOnly}
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Order within {timeUntilMidnight().hours}h {timeUntilMidnight().minutes}m for this delivery date
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <CheckoutSummary />
          </div>
        </div>

        <CheckoutFooter />
      </div>
    </div>
  )
}

export default CheckoutForm