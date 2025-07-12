// src/services/inventoryService.js
import axios from 'axios';
import { INVENTORY_URL } from './config';

export const getInventoryProducts = async (token, status) => {
  try {
    // usa 'out_of_stock', 'caducidad', etc., NO 'todos'
const response = await axios.get(`${INVENTORY_URL}/inventory/products`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  params: {
    status: 'out_of_stock', // ← este SÍ funciona
  },
});

    return response.data;
  } catch (error) {
    console.error('Error desde inventoryService:', error.response?.data || error.message);
    throw error;
  }
};
