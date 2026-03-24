import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/cart';

export const fetchUserCart = async (userId) => {
  const response = await axios.get(`${BASE_URL}/${userId}`);
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const upsertUserCartItem = async ({ userId, productId, quantity }) => {
  return axios.post(`${BASE_URL}/item`, {
    user_id: userId,
    product_id: productId,
    quantity,
  });
};

export const removeUserCartItem = async ({ userId, productId }) => {
  return axios.delete(`${BASE_URL}/${userId}/items/${productId}`);
};

export const clearUserCartApi = async (userId) => {
  return axios.delete(`${BASE_URL}/${userId}/clear`);
};
