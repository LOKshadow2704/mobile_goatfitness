import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

// Định nghĩa kiểu cho sản phẩm và loại sản phẩm
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface Category {
  id: number;
  name: string;
}

// Lấy danh sách sản phẩm
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/products`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể tải danh sách sản phẩm");
  }
};

// Thêm sản phẩm mới
export const addProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");
    const response = await axios.post(
      `${Constants.expoConfig?.extra?.API_URL}/employee/products/add`,
      product,
      {
        headers: {
          PHPSESSID: phpSessId || "",
          Authorization: `Bearer ${accessToken || ""}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể thêm sản phẩm");
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (productId: number, updatedData: Partial<Product>): Promise<Product> => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");
    const response = await axios.put(
      `${Constants.expoConfig?.extra?.API_URL}/employee/products/update`,
      {
        IDSanPham: productId,
        data: {
          ...updatedData
        },
      },
      {
        headers: {
          PHPSESSID: phpSessId || "",
          Authorization: `Bearer ${accessToken || ""}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể cập nhật sản phẩm");
  }
};

// Xóa sản phẩm
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");

    const response = await axios.delete(
      `${Constants.expoConfig?.extra?.API_URL}/employee/products/delete`,
      {
        headers: {
          PHPSESSID: phpSessId || "",
          Authorization: `Bearer ${accessToken || ""}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
        data: { IDSanPham: productId },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(error.response.data)
    throw new Error("Không thể xóa sản phẩm");
  }
};

// Lấy danh sách loại sản phẩm
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/employee/category`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể tải danh sách loại sản phẩm");
  }
};

// Thêm loại sản phẩm
export const addCategory = async (categoryName: string): Promise<Category> => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");
    const response = await axios.post(
      `${Constants.expoConfig?.extra?.API_URL}/employee/category/add`,
      { name: categoryName },
      {
        headers: {
          PHPSESSID: phpSessId || "",
          Authorization: `Bearer ${accessToken || ""}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể thêm loại sản phẩm");
  }
};

// Cập nhật loại sản phẩm
export const updateCategory = async (categoryId: number, newName: string): Promise<Category> => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");
    const response = await axios.put(
      `${Constants.expoConfig?.extra?.API_URL}/employee/category/update`,
      {
        id: categoryId,
        name: newName,
      },
      {
        headers: {
          PHPSESSID: phpSessId || "",
          Authorization: `Bearer ${accessToken || ""}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Không thể cập nhật loại sản phẩm");
  }
};

// Xóa loại sản phẩm
export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");

    await axios.delete(
      `${Constants.expoConfig?.extra?.API_URL}/employee/category/delete`,
      {
        headers: {
          PHPSESSID: phpSessId || "",
          Authorization: `Bearer ${accessToken || ""}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
        data: { id: categoryId },
      }
    );
  } catch (error) {
    throw new Error("Không thể xóa loại sản phẩm");
  }
};

// Lấy danh sách loại sản phẩm (ví dụ thêm)
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/categories`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể tải danh sách loại sản phẩm");
  }
};
