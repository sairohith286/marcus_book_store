import React, { useEffect, useState } from 'react';
import { X, Package, CheckCircle, Clock, ShoppingBag, Banknote } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import BookCoverArt from './BookCoverArt.jsx';

export default function OrdersModal({ isOpen, onClose }) {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch('/api/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FBFBFA] rounded-xl max-w-2xl w-full border border-stone-300/80 shadow-2xl p-6 sm:p-8 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-mono uppercase tracking-wider mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>MongoDB Inscribed History</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Reader Order Archive
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Orders placed under account: <span className="font-medium text-stone-700">{user?.email || 'Guest Reader'}</span>
          </p>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-stone-400 space-y-2">
            <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
            <span className="text-xs">Loading order archive from database...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-stone-400 space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto stroke-1 text-stone-300" />
            <p className="font-serif text-base text-stone-700">No past orders found</p>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Any books ordered with Cash on Delivery will automatically be recorded here.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {orders.map((order) => (
              <div
                key={order._id || order.orderNumber}
                className="p-4 bg-white border border-stone-200/90 rounded-lg shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      <Banknote className="w-3 h-3" />
                      {order.paymentStatus === 'due_on_delivery' ? 'Cash Due on Delivery' : 'COD Settled'}
                    </span>
                    <span className="font-mono font-semibold text-stone-900 tabular-nums">
                      ${order.totalAmount?.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-stone-700">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-stone-400 text-[11px]">
                          {item.quantity}×
                        </span>
                        <span className="font-serif font-medium text-stone-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase font-mono">
                          ({item.category})
                        </span>
                      </div>
                      <span className="font-mono tabular-nums text-stone-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Destination & Phone */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>
                    Ship to: {order.shippingAddress?.city}, {order.shippingAddress?.country || 'USA'}
                    {order.customerPhone ? ` · ${order.customerPhone}` : ''}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-700 font-medium">
                    {order.status === 'preparing_shipment' ? 'Preparing Shipment' : 'Delivered'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
