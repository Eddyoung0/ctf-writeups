import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Plus, Trash2, X } from 'lucide-react';

const initialForm = {
  department: 'clothing',
  name: '',
  price: '',
  oldPrice: '',
  rating: '',
  reviews: '',
  color: '',
  image: '',
  images: '',
  description: '',
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const groupedProducts = products.reduce((acc, product) => {
    const department = String(product.department || 'uncategorized').toLowerCase();
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(product);
    return acc;
  }, {});

  const departmentOrder = ['clothing', 'electronics', 'groceries', 'home-kitchen'];
  const orderedDepartments = [
    ...departmentOrder.filter((department) => groupedProducts[department]?.length),
    ...Object.keys(groupedProducts)
      .filter((department) => !departmentOrder.includes(department))
      .sort(),
  ];

  const formatDepartmentLabel = (department) =>
    department
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  const renderProductRows = (items) => {
    if (!items.length) {
      return (
        <tr>
          <td colSpan={9} className="py-3.5 px-4 text-sm text-gray-400">
            No products found in this category.
          </td>
        </tr>
      );
    }

    return items.map((product) => (
      <tr key={product.id} className="border-b border-gray-50 last:border-b-0">
        <td className="py-3.5 px-4 text-sm text-gray-700">{product.id}</td>
        <td className="py-3.5 px-4 text-sm text-gray-700 capitalize">{product.department || '-'}</td>
        <td className="py-3.5 px-4 text-sm font-semibold text-gray-800">{product.name || '-'}</td>
        <td className="py-3.5 px-4 text-sm text-gray-700">${Number(product.price || 0).toFixed(2)}</td>
        <td className="py-3.5 px-4 text-sm text-gray-700">{Number(product.rating || 0).toFixed(1)}</td>
        <td className="py-3.5 px-4 text-sm text-gray-700">{product.reviews || 0}</td>
        <td className="py-3.5 px-4 text-sm text-gray-700">{product.description || '-'}</td>
        <td className="py-3.5 px-4 text-sm text-gray-500">{new Date(product.created_at).toLocaleString()}</td>
        <td className="py-3.5 px-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEditModal(product)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(product.id)}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const renderMobileProductCards = (items) => {
    if (!items.length) {
      return <p className="text-sm text-gray-400 px-1">No products found in this category.</p>;
    }

    return items.map((product) => (
      <article key={product.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium">ID: {product.id}</p>
            <h3 className="mt-1 text-sm font-semibold text-gray-800 wrap-break-word">{product.name || '-'}</h3>
          </div>
          <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">${Number(product.price || 0).toFixed(2)}</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
          <p><span className="font-medium">Department:</span> {formatDepartmentLabel(product.department || 'uncategorized')}</p>
          <p><span className="font-medium">Rating:</span> {Number(product.rating || 0).toFixed(1)}</p>
          <p><span className="font-medium">Reviews:</span> {product.reviews || 0}</p>
          <p><span className="font-medium">Created:</span> {product.created_at ? new Date(product.created_at).toLocaleDateString() : '-'}</p>
        </div>

        <p className="mt-2 text-xs text-gray-600 wrap-break-word"><span className="font-medium">Description:</span> {product.description || '-'}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openEditModal(product)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(product.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </article>
    ));
  };

  const openModal = () => {
    setError('');
    setFormData(initialForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setError('');
    setEditingId(product.id);
    setFormData({
      department: product.department || 'clothing',
      name: product.name || '',
      price: product.price ?? '',
      oldPrice: product.oldPrice ?? '',
      rating: product.rating ?? '',
      reviews: product.reviews ?? '',
      color: product.color || '',
      image: product.image || '',
      images: Array.isArray(product.images) ? product.images.join(', ') : '',
      description: product.description || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    if (!formData.price || Number.isNaN(Number(formData.price))) {
      setError('Valid product price is required');
      return;
    }

    if (!formData.image.trim()) {
      setError('Image URL is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        department: formData.department,
        name: formData.name,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        rating: formData.rating ? Number(formData.rating) : 0,
        reviews: formData.reviews ? Number(formData.reviews) : 0,
        color: formData.color,
        image: formData.image,
        images: formData.images
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        description: formData.description,
      };
      if (editingId) {
        const response = await axios.put(`http://localhost:5000/api/products/${editingId}`, payload);
        const updatedProduct = response.data?.data;
        if (updatedProduct) {
          setProducts((prev) => prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item)));
        }
      } else {
        const response = await axios.post('http://localhost:5000/api/products', payload);
        const createdProduct = response.data?.data;
        if (createdProduct) {
          setProducts((prev) => [createdProduct, ...prev]);
        }
      }

      setIsModalOpen(false);
      setFormData(initialForm);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm('Delete this product? This action cannot be undone.');
    if (!shouldDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-7">
      <div className="mb-6">
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#007E5D] text-white text-sm font-semibold hover:opacity-90 transition mb-3"
        >
          <Plus size={16} /> Add Product
        </button>
        <h1 className="text-[1.6rem] font-bold tracking-tight">Products</h1>
        <p className="text-gray-500 text-sm mt-1">Create and manage products from the products table.</p>
      </div>

      <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No products found. Use Add Product to create your first record.</div>
        ) : (
          <>
            <div className="md:hidden p-4 space-y-5 bg-[#F9FAFC]">
              {orderedDepartments.map((department) => (
                <section key={department}>
                  <p className="mb-3 py-2 px-3 text-xs font-semibold tracking-wider text-emerald-700 uppercase bg-emerald-50 rounded-lg border border-emerald-100">
                    {formatDepartmentLabel(department)} ({groupedProducts[department].length})
                  </p>
                  <div className="space-y-3">
                    {renderMobileProductCards(groupedProducts[department])}
                  </div>
                </section>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F9FAFC]">
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">ID</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Department</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Name</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Price</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Rating</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Reviews</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Description</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Created</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedDepartments.map((department) => (
                    <React.Fragment key={department}>
                      <tr className="bg-emerald-50/60 border-y border-emerald-100">
                        <td colSpan={9} className="py-2.5 px-4 text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                          {formatDepartmentLabel(department)} ({groupedProducts[department].length})
                        </td>
                      </tr>
                      {renderProductRows(groupedProducts[department])}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg max-h-[88vh] bg-white rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.22)] border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#F5F6FA] hover:text-gray-600 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                >
                  <option value="clothing">Clothing</option>
                  <option value="electronics">Electronics</option>
                  <option value="groceries">Groceries</option>
                  <option value="home-kitchen">Home & Kitchen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                  placeholder="Enter product price"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                    placeholder="0 - 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
                  <input
                    type="number"
                    min="0"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                  placeholder="Optional color"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image URL *</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Image URLs</label>
                <input
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D]"
                  placeholder="Comma separated URLs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007E5D] resize-none"
                  placeholder="Enter product description"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#007E5D] text-white hover:opacity-90 transition disabled:opacity-60"
                >
                  {isSubmitting ? (editingId ? 'Saving...' : 'Creating...') : (editingId ? 'Save Changes' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductsPage;
