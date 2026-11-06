import React, { useState } from 'react';
import {
  X,
  Banknote,
  CheckCircle2,
  Truck,
  ArrowRight,
  Sparkles,
  Printer,
  ShoppingBag,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const { items, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const { user, token } = useAuth();

  const [step, setStep] = useState(1); // 1: Delivery & COD Verification, 2: Order Confirmed

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('+1 (503) 555-0192');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Portland');
  const [state, setState] = useState('OR');
  const [postalCode, setPostalCode] = useState('97201');
  const [country, setCountry] = useState('United States');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Processing & Error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const handleFillDemoVerification = () => {
    setCustomerName(user?.name || 'Julian Vane');
    setCustomerEmail(user?.email || 'reader@marcusbookstore.com');
    setCustomerPhone('+1 (503) 555-0192');
    setAddress('84 Mercer Street, Suite 4B');
    setCity('New York');
    setState('NY');
    setPostalCode('10012');
    setCountry('United States');
    setDeliveryNotes('Ring apartment 4B or leave with doorman upon arrival.');
    setErrorMessage('');
  };

  // Submit Cash on Delivery Order
  const handleConfirmCodOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName || !customerEmail || !customerPhone || !address || !city || !postalCode) {
      setErrorMessage('Please fill in all recipient contact and delivery fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create Cash on Delivery order in database
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          deliveryNotes,
          shippingAddress: { address, city, state, postalCode, country },
          items,
          subtotal,
          shippingFee,
          totalAmount: grandTotal,
          paymentMethod: 'cash_on_delivery',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to confirm order.');
      }

      setCompletedOrder(orderData.order);
      clearCart();
      setStep(2);
      if (onOrderPlaced) onOrderPlaced(orderData.order);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FBFBFA] rounded-xl max-w-2xl w-full border border-stone-300/80 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#F8F7F4]">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold text-stone-900">
              Marcus Book Store
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-mono text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5 text-stone-600" />
              {step === 1 ? 'Cash on Delivery (COD) Checkout' : 'Order Confirmed'}
            </span>
          </div>

          {step !== 2 && (
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8">
          
          {/* STEP 1: Delivery Details & Cash on Delivery Verification */}
          {step === 1 && (
            <form onSubmit={handleConfirmCodOrder} className="space-y-5">
              
              {/* Header & Quick Autofill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200/80">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Recipient & Delivery Verification
                  </h3>
                  <p className="text-xs text-stone-500">
                    Payment is collected exclusively in cash upon courier arrival at your door.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoVerification}
                  className="flex items-center gap-1 text-[11px] font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded transition-colors self-start sm:self-auto"
                >
                  <Sparkles className="w-3 h-3 text-stone-500" />
                  Auto-fill Test Details
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Cash on Delivery Policy Notice */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold text-amber-950">
                  <span className="flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-amber-800" />
                    Cash on Delivery Terms
                  </span>
                  <span className="font-mono text-[11px] text-amber-800 uppercase tracking-wider">
                    Zero Prepayment
                  </span>
                </div>
                <p className="text-amber-900/90 leading-relaxed text-[11px]">
                  No upfront online payment required. Inspect your archival book packages upon arrival and hand the payment of <strong className="font-mono tabular-nums text-stone-900">${grandTotal.toFixed(2)} USD</strong> directly to the courier.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-amber-800">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Complimentary Courier Packaging
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    SMS/Phone Notice Prior to Delivery
                  </span>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Julian Vane"
                    className="w-full text-xs bg-white border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Contact Phone * (For Courier)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (503) 555-0192"
                    className="w-full text-xs bg-white border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="reader@marcusbookstore.com"
                    className="w-full text-xs bg-white border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Street Address & Apartment / Suite *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="84 Mercer Street, Suite 4B"
                  className="w-full text-xs bg-white border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Portland"
                    className="w-full text-xs bg-white border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="OR"
                    className="w-full text-xs bg-white border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="97201"
                    className="w-full text-xs bg-white border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                  />
                </div>
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Delivery Notes & Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Ring buzzer 4B, or call 10 minutes prior to arrival"
                  className="w-full text-xs bg-white border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                />
              </div>

              {/* Order Amount Breakdown */}
              <div className="p-4 bg-stone-100/90 rounded-lg text-xs space-y-1.5 font-sans border border-stone-200">
                <div className="flex justify-between text-stone-600">
                  <span>Selected Volumes ({items.length})</span>
                  <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Courier Delivery Fee</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? 'Complimentary ($50+ Threshold)' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-stone-950 pt-2 border-t border-stone-200 text-sm">
                  <span>Total Due on Arrival</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    ${grandTotal.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Confirm COD Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Inscribing Order in Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirm Order with Cash on Delivery (${grandTotal.toFixed(2)})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                  Verified Cash on Delivery (COD)
                </span>
                <span>·</span>
                <span>No credit card required</span>
              </div>
            </form>
          )}

          {/* STEP 2: Order Confirmation Screen */}
          {step === 2 && completedOrder && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                <Banknote className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-mono tracking-widest text-amber-800 font-semibold block mb-1">
                  Cash on Delivery Confirmed
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Order {completedOrder.orderNumber} Confirmed — Preparing Shipment
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Thank you, {completedOrder.customerName}. Your order has been recorded into the MongoDB datastore. Please prepare payment for when the courier arrives.
                </p>
              </div>

              {/* Prominent COD Due Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-amber-950 font-semibold text-sm pb-1 border-b border-amber-200">
                  <span>Amount to Hand to Courier</span>
                  <span className="font-mono text-base font-bold text-amber-900 tabular-nums">
                    ${completedOrder.totalAmount?.toFixed(2)} USD
                  </span>
                </div>
                <div className="text-[11px] text-amber-900/80 space-y-1">
                  <p>• Accepted payment: Cash or local courier mobile contactless tap.</p>
                  <p>• The courier will phone <strong className="font-mono">{completedOrder.customerPhone}</strong> prior to delivery.</p>
                  <p>• Estimated arrival: <strong>2–3 business days</strong>.</p>
                </div>
              </div>

              {/* Receipt Summary Box */}
              <div className="p-4 bg-stone-100 rounded-lg text-left text-xs space-y-2.5 font-sans border border-stone-200">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="font-mono text-stone-500 uppercase text-[11px]">
                    Order Number
                  </span>
                  <span className="font-mono font-bold text-stone-900">
                    {completedOrder.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Payment Method</span>
                  <span className="font-medium text-stone-900">
                    Cash on Delivery (COD)
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Shipping Destination</span>
                  <span className="text-stone-800 text-right">
                    {completedOrder.shippingAddress?.address}, {completedOrder.shippingAddress?.city}, {completedOrder.shippingAddress?.state} {completedOrder.shippingAddress?.postalCode}
                  </span>
                </div>

                {completedOrder.deliveryNotes && (
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Instructions</span>
                    <span className="text-stone-700 italic text-right max-w-xs truncate">
                      "{completedOrder.deliveryNotes}"
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Volumes Ordered</span>
                  <span className="font-mono tabular-nums text-stone-800">
                    {completedOrder.items?.length} items
                  </span>
                </div>

                <div className="flex justify-between font-semibold text-stone-950 pt-2 border-t border-stone-200 text-sm">
                  <span>Total Due on Arrival</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    ${completedOrder.totalAmount?.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Delivery Slip
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
