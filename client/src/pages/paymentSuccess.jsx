import React, { useEffect } from 'react';
import { CheckCircle2, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10">
        <div className="bg-white rounded-2xl border border-neutral-200 p-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <CheckCircle2 size={52} className="mx-auto text-[#007E5D]" />
          <h1 className="mt-4 text-3xl font-semibold text-neutral-900">Payment Complete</h1>
          <p className="mt-3 text-neutral-600">
            Your order has been placed successfully. You can now track delivery progress from your orders page.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600">
            <Truck size={16} /> Tracking starts from Processing status
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Go to Your Orders
            </button>
            <button
              type="button"
              onClick={() => navigate('/product')}
              className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
