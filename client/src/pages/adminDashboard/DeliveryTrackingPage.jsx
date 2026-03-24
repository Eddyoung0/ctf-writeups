import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const statusOptions = ['processing', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'];

const paymentLabel = (value) => {
  if (!value) return 'Card';
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const paymentStatusLabel = (value) => (value === 'pending' ? 'unpaid' : value || 'pending');

const DeliveryTrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingOrderId, setSavingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load delivery tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFieldChange = (orderId, field, value) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, [field]: value } : order)));
  };

  const saveDeliveryStatus = async (order) => {
    setSavingOrderId(order.id);
    setError('');

    try {
      const response = await axios.patch(`http://localhost:5000/api/orders/${order.id}/delivery-status`, {
        delivery_status: order.delivery_status,
        tracking_note: order.tracking_note,
      });

      const updated = response.data?.data;
      if (updated) {
        setOrders((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update delivery status');
    } finally {
      setSavingOrderId(null);
    }
  };

  const deleteOrder = async (orderId) => {
    const shouldDelete = window.confirm('Delete this order record?');
    if (!shouldDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((item) => item.id !== orderId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order');
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-7">
      <div className="mb-6">
        <h1 className="text-[1.6rem] font-bold tracking-tight">Delivery Tracking</h1>
        <p className="text-gray-500 text-sm mt-1">Update delivery status per order and user.</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading delivery records...</div>
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
                    <span className="text-[0.68rem] px-2 py-1 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wide">
                      {paymentStatusLabel(order.payment_status)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-gray-700">
                    <p className="font-semibold text-gray-800 wrap-break-word">{order.user_name}</p>
                    <p className="text-xs text-gray-500 break-all">{order.user_email}</p>
                    <p className="wrap-break-word"><span className="font-medium text-gray-600">Product:</span> {order.product_name}</p>
                    <p><span className="font-medium text-gray-600">Payment:</span> {paymentLabel(order.payment_method)}</p>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Delivery Status</label>
                    <select
                      value={order.delivery_status}
                      onChange={(e) => handleFieldChange(order.id, 'delivery_status', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-[#007E5D]"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Tracking Note</label>
                    <input
                      type="text"
                      value={order.tracking_note || ''}
                      onChange={(e) => handleFieldChange(order.id, 'tracking_note', e.target.value)}
                      placeholder="e.g. Rider assigned"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#007E5D]"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => saveDeliveryStatus(order)}
                      disabled={savingOrderId === order.id}
                      className="rounded-lg bg-[#007E5D] px-3 py-2 text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-60"
                    >
                      {savingOrderId === order.id ? 'Saving...' : 'Update'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteOrder(order.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-red-600 text-xs font-semibold hover:bg-red-50 transition inline-flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
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
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Payment</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Tracking Note</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Action</th>
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
                      <td className="py-3.5 px-4 text-sm text-gray-700">
                        <p className="font-medium text-gray-800">{paymentLabel(order.payment_method)}</p>
                        <p className="text-xs text-gray-500 uppercase">{paymentStatusLabel(order.payment_status)}</p>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-700 min-w-[170px]">
                        <select
                          value={order.delivery_status}
                          onChange={(e) => handleFieldChange(order.id, 'delivery_status', e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-[#007E5D]"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-700 min-w-[260px]">
                        <input
                          type="text"
                          value={order.tracking_note || ''}
                          onChange={(e) => handleFieldChange(order.id, 'tracking_note', e.target.value)}
                          placeholder="e.g. Rider assigned"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#007E5D]"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveDeliveryStatus(order)}
                            disabled={savingOrderId === order.id}
                            className="rounded-lg bg-[#007E5D] px-3 py-2 text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-60"
                          >
                            {savingOrderId === order.id ? 'Saving...' : 'Update'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteOrder(order.id)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-red-600 text-xs font-semibold hover:bg-red-50 transition inline-flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
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

export default DeliveryTrackingPage;
