'use client'

import { useEffect, useState } from 'react'
import { getUserOrders } from '@/app/_api/orders'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTruck,
  FiShoppingBag,
  FiChevronRight
} from 'react-icons/fi'
import { Order } from '@/app/interfaces'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const response = await getUserOrders()
      setOrders(response?.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error loading orders')
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])


  const getStatusFromOrder = (
    order: Order
  ): 'delivered' | 'processing' | 'pending' | 'shipped' | 'cancelled' => {
    if (order.isDelivered) return 'delivered'
    if (order.isPaid) return 'processing'
    return order.status || 'pending'
  }

  const getStatusStyles = (order: Order) => {
    const status = getStatusFromOrder(order)
    switch (status) {
      case 'delivered':
        return 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200'
      case 'shipped':
        return 'text-blue-700 bg-blue-50 ring-1 ring-blue-200'
      case 'processing':
        return 'text-amber-700 bg-amber-50 ring-1 ring-amber-200'
      case 'pending':
        return 'text-slate-600 bg-slate-50 ring-1 ring-slate-200'
      case 'cancelled':
        return 'text-rose-700 bg-rose-50 ring-1 ring-rose-200'
      default:
        return 'text-slate-600 bg-slate-50 ring-1 ring-slate-200'
    }
  }

  const getStatusIcon = (order: Order) => {
    const status = getStatusFromOrder(order)
    switch (status) {
      case 'delivered': return <FiCheckCircle className="w-3.5 h-3.5" />
      case 'shipped': return <FiTruck className="w-3.5 h-3.5" />
      case 'processing': return <FiClock className="w-3.5 h-3.5" />
      case 'cancelled': return <FiXCircle className="w-3.5 h-3.5" />
      default: return <FiClock className="w-3.5 h-3.5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
          <p className="text-slate-500 font-bold animate-pulse tracking-widest text-xs uppercase">Loading Your History</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <Link
              href="/profile"
              className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-slate-900 hover:shadow-md transition-all"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Purchase History</h1>
              <p className="text-slate-500 font-medium">Tracking {orders.length} orders in total</p>
            </div>
          </div>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <FiShoppingBag />
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders found</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">It looks like you haven't made any purchases yet. Start exploring our latest products!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="group bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                {/* Order Top Bar */}
                <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter leading-none mb-1">Order Ref</p>
                      <p className="font-mono font-bold text-slate-900 text-sm tracking-tighter leading-none">
                        #{order.id || order._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter leading-none mb-1">Date Placed</p>
                      <p className="font-bold text-slate-700 text-sm leading-none">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest ${getStatusStyles(order)}`}>
                    {getStatusIcon(order)}
                    {getStatusFromOrder(order)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-8">
                  <div className="divide-y divide-slate-50">
                    {order.cartItems?.map((item, index) => (
                      <div key={item._id || index} className="py-4 first:pt-0 last:pb-0 flex items-center gap-6">
                        <div className="relative">
                          <img
                            src={item.product.imageCover}
                            alt={item.product.title}
                            className="w-20 h-20 object-cover rounded-2xl shadow-sm border border-slate-100"
                          />
                          <span className="absolute -top-2 -right-2 w-7 h-7 bg-slate-900 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-white">
                            {item.count}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 truncate max-w-md">
                            {item.product.title}
                          </h4>
                          <p className="text-slate-400 text-sm font-medium mt-1">
                            Unit Price: <span className="text-slate-600">{item.price} EGP</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 tracking-tight">
                            {item.price * item.count} <span className="text-[10px] text-slate-400">EGP</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer: Summary & Details */}
                <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FiMapPin className="text-rose-500 w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">{order.shippingAddress.city || 'Standard Delivery'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FiCreditCard className="text-blue-500 w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">
                        {order.paymentMethodType === 'card' ? 'Visa / Card' : 'Cash Payment'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Total Amount</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">
                        {order.totalOrderPrice} <span className="text-sm font-bold text-rose-500 uppercase ml-1">Egp</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}