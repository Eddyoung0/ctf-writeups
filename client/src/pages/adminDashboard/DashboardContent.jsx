import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, DollarSign, Users, Box, ArrowRight } from 'lucide-react';

const API = 'http://localhost:5000/api/orders/overview';

const kpiCardStyles = [
  { icon: ShoppingBag, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-700' },
  { icon: DollarSign, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { icon: Users, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  { icon: Box, iconBg: 'bg-[#EAF7F3]', iconColor: 'text-[#007E5D]' },
];

const DashboardContent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState(null);

  const fetchOverview = async () => {
    try {
      const response = await axios.get(API);
      setOverview(response.data?.data || null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    const intervalId = setInterval(fetchOverview, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const kpis = useMemo(() => {
    const data = overview?.kpis || {};
    return [
      { label: 'Total Orders', value: Number(data.totalOrders || 0).toLocaleString() },
      { label: 'Revenue (Paid)', value: `$${Number(data.totalRevenue || 0).toFixed(2)}` },
      { label: 'Customers', value: Number(data.totalCustomers || 0).toLocaleString() },
      { label: 'Products', value: Number(data.totalProducts || 0).toLocaleString() },
    ];
  }, [overview]);

  const salesSeries = overview?.salesSeries || [];
  const topDepartments = overview?.topDepartments || [];
  const recentOrders = overview?.recentOrders || [];
  const deliveryQueue = overview?.deliveryQueue || [];

  const maxSeries = Math.max(1, ...salesSeries.map((item) => Number(item.revenue || 0)));

  return (
    <main className="flex-1 p-4 sm:p-7 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-[1.6rem] font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Live store overview auto-refreshes every 15 seconds.</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {kpis.map((kpi, i) => {
          const Icon = kpiCardStyles[i].icon;
          return (
            <div key={kpi.label} className="bg-white rounded-[14px] p-[22px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-start gap-4 border border-transparent hover:border-gray-100 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpiCardStyles[i].iconBg} ${kpiCardStyles[i].iconColor} shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <h2 className="text-[1.65rem] font-bold tracking-tight leading-tight">{kpi.value}</h2>
                <p className="text-[0.82rem] text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 mb-6">
        <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="px-6 pt-5 pb-4">
            <h3 className="text-[1.05rem] font-semibold">Revenue Trend (Last 7 Days)</h3>
          </div>
          {loading ? (
            <div className="h-[220px] px-6 pb-6 pt-2 flex items-center justify-center text-sm text-gray-400">Loading sales chart...</div>
          ) : !salesSeries.length ? (
            <div className="h-[220px] px-6 pb-6 pt-2 flex items-center justify-center text-sm text-gray-400">No sales data yet.</div>
          ) : (
            <div className="flex items-end gap-3 sm:gap-4 h-[220px] px-6 pb-6 pt-2">
              {salesSeries.map((row) => {
                const height = (Number(row.revenue || 0) / maxSeries) * 180;
                return (
                  <div key={String(row.day)} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-full max-w-6 rounded-t-md bg-[#007E5D] hover:opacity-80 transition"
                      style={{ height: `${Math.max(8, height)}px` }}
                      title={`$${Number(row.revenue || 0).toFixed(2)} | ${Number(row.orders || 0)} orders`}
                    />
                    <span className="text-[0.72rem] text-gray-500 font-medium">
                      {new Date(row.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-5">
          <h3 className="text-[1.05rem] font-semibold mb-4">Store Status</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Pending Deliveries</span><span className="font-semibold">{Number(overview?.kpis?.pendingDeliveries || 0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Orders Today</span><span className="font-semibold">{Number(overview?.kpis?.todayOrders || 0)}</span></div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <h3 className="text-[1.05rem] font-semibold">Top Selling Departments</h3>
            <span className="text-[0.82rem] text-[#007E5D] font-medium flex items-center gap-1">Live <ArrowRight size={14} /></span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-6 pb-6">
            {topDepartments.length ? topDepartments.map((dep) => (
              <div key={dep.department} className="bg-[#F5F6FA] rounded-[10px] p-[18px] text-center">
                <h4 className="text-sm font-semibold mb-1 capitalize">{String(dep.department || '').replace('-', ' ')}</h4>
                <p className="text-[0.78rem] text-gray-500 mb-1">{Number(dep.orders || 0)} orders</p>
                <p className="text-[0.78rem] text-gray-600">${Number(dep.revenue || 0).toFixed(2)}</p>
              </div>
            )) : <div className="col-span-full text-center text-sm text-gray-400 py-6">No department sales data yet.</div>}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="px-6 pt-5 pb-4">
            <h3 className="text-[1.05rem] font-semibold">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-3">Order ID</th>
                  <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-3">Customer</th>
                  <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-3">Product</th>
                  <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-3">Value</th>
                  <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length ? recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 last:border-b-0">
                    <td className="py-3.5 px-3 text-sm font-semibold text-[#007E5D]">#{order.id}</td>
                    <td className="py-3.5 px-3 text-sm">{order.customer}</td>
                    <td className="py-3.5 px-3 text-sm">{order.product}</td>
                    <td className="py-3.5 px-3 text-sm">${Number(order.total_price || 0).toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-sm capitalize">{order.delivery_status}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-8 px-3 text-center text-sm text-gray-400">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="px-5 pt-5 pb-4">
            <h3 className="text-[1.05rem] font-semibold">Delivery Queue</h3>
          </div>
          <div className="px-5 pb-5 flex flex-col gap-1.5">
            {deliveryQueue.length ? deliveryQueue.map((item) => (
              <div key={item.id} className="p-3.5 rounded-[10px] hover:bg-[#F5F6FA] transition">
                <strong className="block text-[0.9rem] font-semibold">#{item.id} - {item.name}</strong>
                <span className="text-[0.78rem] text-gray-500">{item.product_name}</span>
                <p className="text-[0.75rem] text-[#007E5D] mt-1 capitalize">{item.delivery_status}</p>
              </div>
            )) : <div className="py-8 text-center text-sm text-gray-400">No pending deliveries.</div>}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardContent;
