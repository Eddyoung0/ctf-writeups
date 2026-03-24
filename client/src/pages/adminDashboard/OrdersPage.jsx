import React, { useEffect, useState } from 'react';
import axios from 'axios';

const paymentLabel = (value) => {
  if (!value) return 'Card';
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data?.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 15000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="flex-1 p-4 sm:p-7">
      <div className="mb-6">
        <h1 className="text-[1.6rem] font-bold tracking-tight">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Read-only order list with user and product details.</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No orders found yet.</div>
        ) : (
          <>
            <div className="md:hidden p-4 space-y-3 bg-[#F9FAFC]">
              {orders.map((order) => (
                <article key={order.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">Order #{order.id}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">User ID: {order.user_id}</p>
                    </div>
                    <p className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{paymentLabel(order.payment_method)}</p>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-gray-700">
                    <p className="font-semibold text-gray-800 wrap-break-word">{order.user_name}</p>
                    <p className="text-xs text-gray-500 break-all">{order.user_email}</p>
                    <p className="wrap-break-word"><span className="font-medium text-gray-600">Product:</span> {order.product_name}</p>
                    <p><span className="font-medium text-gray-600">Quantity:</span> {order.quantity}</p>
                    <p><span className="font-medium text-gray-600">Total:</span> ${Number(order.total_price || 0).toFixed(2)}</p>
                    <p><span className="font-medium text-gray-600">Ordered:</span> {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F9FAFC]">
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Order ID</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">User ID</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">User</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Product</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Qty</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Total</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Payment</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Ordered At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 last:border-b-0 align-top">
                      <td className="py-3.5 px-4 text-sm text-gray-700">#{order.id}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">{order.user_id}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">
                        <p className="font-semibold text-gray-800">{order.user_name}</p>
                        <p className="text-xs text-gray-500">{order.user_email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">{order.product_name}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">{order.quantity}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">${Number(order.total_price || 0).toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">{paymentLabel(order.payment_method)}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default OrdersPage;
