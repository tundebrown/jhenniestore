import { Metadata } from 'next'
import Link from 'next/link'

import Pagination from '@/components/shared/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getMyOrders } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime, formatId } from '@/lib/utils'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { 
  Calendar, 
  CreditCard, 
  Package, 
  ChevronRight, 
  ArrowLeft,
  FileText
} from 'lucide-react'

const PAGE_TITLE = 'Your Orders'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const orders = await getMyOrders({
    page,
  })
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/account" className="flex items-center hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Your Account
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground">{PAGE_TITLE}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{PAGE_TITLE}</h1>
        <div className="text-sm text-muted-foreground">
          {orders.totalPages > 1 && (
            <span>Page {page} of {orders.totalPages}</span>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-lg border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Delivery</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">You have no orders yet.</p>
                    <Button asChild variant="outline" className="mt-2">
                      <Link href="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.data.map((order: IOrder) => (
                <TableRow key={order._id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <Link 
                      href={`/account/orders/${order._id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {formatId(order._id)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDateTime(order.createdAt!).dateTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ProductPrice price={order.totalPrice} plain className="font-semibold" />
                  </TableCell>
                  <TableCell>
                    {order.isPaid && order.paidAt ? (
                      <Badge variant="success" className="gap-1">
                        <CreditCard className="h-3 w-3" />
                        {formatDateTime(order.paidAt).dateTime}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered && order.deliveredAt ? (
                      <Badge variant="success" className="gap-1">
                        <Package className="h-3 w-3" />
                        {formatDateTime(order.deliveredAt).dateTime}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Processing</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/account/orders/${order._id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.data.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center justify-center gap-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">You have no orders yet.</p>
              <Button asChild variant="outline">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          orders.data.map((order: IOrder) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <Link 
                      href={`/account/orders/${order._id}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      Order: {formatId(order._id)}
                    </Link>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateTime(order.createdAt!).dateTime}
                    </p>
                  </div>
                  <ProductPrice 
                    price={order.totalPrice} 
                    plain 
                    className="text-lg font-bold" 
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment</p>
                    {order.isPaid && order.paidAt ? (
                      <Badge variant="success" className="gap-1">
                        <CreditCard className="h-3 w-3" />
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Delivery</p>
                    {order.isDelivered && order.deliveredAt ? (
                      <Badge variant="success" className="gap-1">
                        <Package className="h-3 w-3" />
                        Delivered
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Processing</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 py-3">
                <Button asChild variant="link" className="ml-auto p-0 h-auto">
                  <Link href={`/account/orders/${order._id}`} className="flex items-center">
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {orders.totalPages > 1 && (
        <div className="mt-8">
          <Pagination page={page} totalPages={orders.totalPages} />
        </div>
      )}

      <BrowsingHistoryList className='mt-16' />
    </div>
  )
}
