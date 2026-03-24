import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/products';

export const fetchProducts = async (department) => {
  const response = await axios.get(BASE_URL, {
    params: department ? { department } : undefined,
  });

  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const fetchProductById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data?.data || null;
};
