import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PRODUCT_PAGE_CATEGORIES = [
  { key: 'electronics', label: 'Electronics', path: '/product/electronics' },
  { key: 'groceries', label: 'Groceries', path: '/product/groceries' },
  { key: 'clothing', label: 'Clothing', path: '/product' },
  { key: 'home-kitchen', label: 'Home Kitchen', path: '/product/home-kitchen' },
];

const normalizeCategoryKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-');

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      const rows = response.data?.data || [];
      const categoriesByKey = rows.reduce((acc, item) => {
        const key = normalizeCategoryKey(item.name);
        if (key) {
          acc[key] = item;
        }
        return acc;
      }, {});

      const merged = PRODUCT_PAGE_CATEGORIES.map((item, idx) => {
        const dbRecord = categoriesByKey[item.key];
        return {
          id: dbRecord?.id || `product-category-${idx + 1}`,
          name: item.label,
          path: item.path,
          created_at: dbRecord?.created_at || null,
        };
      });

      setCategories(merged);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    const intervalId = setInterval(fetchCategories, 15000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="flex-1 p-4 sm:p-7">
      <div className="mb-6">
        <h1 className="text-[1.6rem] font-bold tracking-tight">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">These categories are synced with the four product-page sections.</p>
      </div>

      <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No categories found.</div>
        ) : (
          <>
            <div className="md:hidden p-4 space-y-3 bg-[#F9FAFC]">
              {categories.map((category) => (
                <article key={category.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-gray-800 wrap-break-word">{category.name}</h3>
                    <span className="text-[0.68rem] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{category.id}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 break-all"><span className="font-medium">Route:</span> {category.path}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    <span className="font-medium">Created:</span> {category.created_at ? new Date(category.created_at).toLocaleString() : 'Not in categories table'}
                  </p>
                </article>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F9FAFC]">
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">ID</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Name</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Product Route</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-50 last:border-b-0">
                      <td className="py-3.5 px-4 text-sm text-gray-700">{category.id}</td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-800">{category.name}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-600">{category.path}</td>
                      <td className="py-3.5 px-4 text-sm text-gray-500">
                        {category.created_at ? new Date(category.created_at).toLocaleString() : 'Not in categories table'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </main>
  );
};

export default CategoriesPage;
