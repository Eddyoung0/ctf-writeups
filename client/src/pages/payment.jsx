import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { fetchProducts } from '../lib/productsApi';
import { clearCart, getCartItems } from '../lib/shopStorage';
import { getAuthUser } from '../lib/auth';

const PAYMENT_OPTIONS = [
  { id: 'esewa', label: 'eSewa', helper: 'Popular mobile wallet in Nepal' },
  { id: 'khalti', label: 'Khalti', helper: 'Instant payment via Khalti wallet' },
  { id: 'ime-pay', label: 'IME Pay', helper: 'Pay securely with IME Pay' },
  { id: 'bank-transfer', label: 'Bank Account', helper: 'Pay via bank transfer/deposit' },
  { id: 'card', label: 'Card Payment', helper: 'Debit/Credit card checkout' },
  { id: 'cash-on-delivery', label: 'Cash on Delivery', helper: 'Pay cash at doorstep' },
];

const PROCESSING_STEPS = [
  'Validating payment details',
  'Securing transaction channel',
  'Confirming your order',
];

const Payment = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('esewa');

  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    walletNumber: '',
    transactionRef: '',
    bankAccountName: '',
    bankAccountNumber: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const user = getAuthUser();
    if (!user?.id) {
      navigate('/login');
      return;
    }

    setCartItems(getCartItems());

    const loadProducts = async () => {
      try {
        const rows = await fetchProducts();
        setProducts(rows);
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
  }, [navigate]);

  useEffect(() => {
    if (!isSubmitting) {
      setProcessingStepIndex(0);
      return undefined;
    }

    const intervalId = setInterval(() => {
      setProcessingStepIndex((prev) => (prev + 1) % PROCESSING_STEPS.length);
    }, 900);

    return () => clearInterval(intervalId);
  }, [isSubmitting]);

  const itemsWithDetails = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          return product ? { ...product, quantity: item.quantity } : null;
        })
        .filter(Boolean),
    [cartItems, products]
  );

  const total = useMemo(
    () => itemsWithDetails.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [itemsWithDetails]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'card') {
      if (!form.cardName.trim() || !form.cardNumber.trim() || !form.expiry.trim() || !form.cvv.trim()) {
        setError('Please fill all card payment fields');
        return;
      }
    }

    if (paymentMethod === 'esewa' || paymentMethod === 'khalti' || paymentMethod === 'ime-pay') {
      if (!form.walletNumber.trim() || !form.transactionRef.trim()) {
        setError('Please provide wallet number and transaction reference');
        return;
      }
    }

    if (paymentMethod === 'bank-transfer') {
      if (!form.bankAccountName.trim() || !form.bankAccountNumber.trim()) {
        setError('Please provide bank account details');
        return;
      }
    }

    if (itemsWithDetails.length === 0) {
      setError('Your cart is empty');
      return;
    }

    const user = getAuthUser();
    if (!user?.id) {
      setError('Please login again to continue');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/orders/checkout', {
        user_id: Number(user.id),
        payment_method: paymentMethod,
        items: itemsWithDetails.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      });

      clearCart();
      if (paymentMethod === 'cash-on-delivery') {
        toast.success('Order placed with Cash on Delivery. Payment status: unpaid');
      } else {
        toast.success('Payment successful. Order placed!');
      }
      navigate('/payment/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-14 relative">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-neutral-200 p-6 text-center shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
            <Loader2 size={34} className="mx-auto text-[#007E5D] animate-spin" />
            <h2 className="mt-4 text-lg font-semibold text-neutral-900">Processing your transaction</h2>
            <p className="mt-2 text-sm text-neutral-600">{PROCESSING_STEPS[processingStepIndex]}...</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
              <div className="h-full w-1/2 rounded-full bg-[#007E5D] animate-pulse" />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <section className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={20} className="text-[#007E5D]" />
              <h1 className="text-2xl font-semibold text-neutral-900">Payment Process</h1>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PAYMENT_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`rounded-lg border px-3 py-2.5 cursor-pointer transition ${paymentMethod === option.id ? 'border-[#007E5D] bg-emerald-50' : 'border-gray-200 bg-white hover:border-[#007E5D]'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={paymentMethod === option.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <p className="text-sm font-semibold text-neutral-900">{option.label}</p>
                      <p className="text-xs text-neutral-500">{option.helper}</p>
                    </label>
                  ))}
                </div>
              </div>

              {(paymentMethod === 'esewa' || paymentMethod === 'khalti' || paymentMethod === 'ime-pay') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Number</label>
                    <input
                      type="text"
                      name="walletNumber"
                      value={form.walletNumber}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Reference</label>
                    <input
                      type="text"
                      name="transactionRef"
                      value={form.transactionRef}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                      placeholder="Enter transaction ID"
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'bank-transfer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      name="bankAccountName"
                      value={form.bankAccountName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                      placeholder="Account holder name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={form.bankAccountNumber}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                      placeholder="Enter account number"
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'card' && (
                <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={form.cardName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                  placeholder="Name on card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={form.cvv}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                    placeholder="***"
                  />
                </div>
              </div>
                </>
              )}

              {paymentMethod === 'cash-on-delivery' && (
                <div className="rounded-lg border border-[#BFE7DB] bg-[#EAF7F3] px-3 py-3 text-sm text-[#016B4F]">
                  Cash on Delivery selected. Your order will be created with payment status unpaid and delivery status processing.
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 rounded-lg bg-[#007E5D] px-4 py-3 text-sm font-semibold text-white hover:bg-[#016B4F] transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : paymentMethod === 'cash-on-delivery' ? (
                  'Place COD Order'
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </button>

              <p className="text-xs text-gray-500 flex items-center gap-1 justify-center">
                <Lock size={12} /> Secure checkout simulation for project workflow
              </p>
            </form>
          </section>

          <aside className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)] h-max">
            <h2 className="text-lg font-semibold text-neutral-900">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {itemsWithDetails.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm text-neutral-700">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-neutral-200 pt-3 flex items-center justify-between font-semibold text-neutral-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Payment;
