import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import OrderDetailsForm from '@/components/shared/order/order-details-form'
import Link from 'next/link'
import { formatId } from '@/lib/utils'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  return {
    title: `Order ${formatId(params.id)}`,
  }
}

export default async function OrderDetailsPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params
  const { id } = params
  const order = await getOrderById(id)
  if (!order) notFound()
  const session = await auth()

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link 
          href="/account" 
          className="flex items-center hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Your Account
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link 
          href="/account/orders" 
          className="hover:text-foreground transition-colors"
        >
          Your Orders
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground">Order {formatId(order._id)}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order {formatId(order._id)}</h1>
          <p className="text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt!).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/account/orders" 
            className={buttonVariants({ variant: "outline" })}
          >
            Back to Orders
          </Link>
        </div>
      </div>

      <OrderDetailsForm
        order={order}
        isAdmin={session?.user?.role === 'Admin' || false}
      />
    </div>
  )
}
