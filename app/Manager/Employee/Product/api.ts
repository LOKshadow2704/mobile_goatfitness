import axios from 'axios';
import Constants from 'expo-constants';

// Định nghĩa kiểu cho sản phẩm
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}


// Lấy danh sách sản phẩm
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể tải danh sách sản phẩm");
  }
};

// Thêm sản phẩm mới
export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await axios.post(`${Constants.expoConfig?.extra?.API_URL}/add`, product);
    return response.data;
  } catch (error) {
    throw new Error("Không thể thêm sản phẩm");
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (productId: number, updatedData: Partial<Product>): Promise<Product> => {
  try {
    const response = await axios.put(`${Constants.expoConfig?.extra?.API_URL}/update/${productId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error("Không thể cập nhật sản phẩm");
  }
};

// Xóa sản phẩm
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    await axios.delete(`${Constants.expoConfig?.extra?.API_URL}/delete/${productId}`);
  } catch (error) {
    throw new Error("Không thể xóa sản phẩm");
  }
};

// Cập nhật số lượng sản phẩm
export const updateStock = async (productId: number, quantity: number): Promise<void> => {
  try {
    await axios.put(`${Constants.expoConfig?.extra?.API_URL}/update-stock/${productId}`, { quantity });
  } catch (error) {
    throw new Error("Không thể cập nhật số lượng sản phẩm");
  }
};
