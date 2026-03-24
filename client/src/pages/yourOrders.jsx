import React, { useEffect, useState } from 'react';
import { PackageSearch, Clock3, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthUser } from '../lib/auth';

const YourOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusClasses = {
    processing: 'bg-[#EAF7F3] text-[#016B4F]',
    packed: 'bg-purple-100 text-purple-700',
    shipped: 'bg-blue-100 text-blue-700',
    'out-for-delivery': 'bg-sky-100 text-sky-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const paymentLabel = (value) => {
    if (!value) return 'Card';
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const paymentStatusLabel = (value) => (value === 'pending' ? 'unpaid' : value);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadOrders = async () => {
      const user = getAuthUser();
      if (!user?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
        setOrders(response.data?.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="bg-linear-to-r from-[#007E5D] to-[#03a679] px-6 py-8 text-white">
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">Orders</p>
            <h1 className="mt-2 text-3xl font-semibold">Your Orders</h1>
            <p className="mt-2 text-sm opacity-90">Track your order status and recent activity.</p>
          </div>

          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-neutral-600">
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
              <PackageSearch size={34} className="mx-auto text-neutral-400" />
              <h2 className="mt-4 text-xl font-semibold text-neutral-900">No orders yet</h2>
              <p className="mt-2 text-sm text-neutral-600">
                You have not placed any orders yet. Start shopping and your orders will appear here.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5">
                  <Clock3 size={14} /> Processing updates
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5">
                  <Truck size={14} /> Delivery tracking
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/product')}
                className="mt-7 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Browse Products
              </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={order.product_image} alt={order.product_name} className="w-14 h-14 rounded-lg object-cover border border-neutral-200" />
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-900">{order.product_name}</h3>
                          <p className="text-xs text-neutral-500">Order ID #{order.id} • Qty {order.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-neutral-900">${Number(order.total_price || 0).toFixed(2)}</p>
                        <p className="text-xs text-neutral-500">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 uppercase">{paymentStatusLabel(order.payment_status)}</span>
                      <span className={`px-2.5 py-1 rounded-full uppercase ${statusClasses[order.delivery_status] || 'bg-neutral-100 text-neutral-700'}`}>
                        {order.delivery_status}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">{paymentLabel(order.payment_method)}</span>
                    </div>

                    <p className="mt-3 text-sm text-neutral-600">
                      Tracking: {order.tracking_note || 'No tracking updates yet.'}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourOrders;
