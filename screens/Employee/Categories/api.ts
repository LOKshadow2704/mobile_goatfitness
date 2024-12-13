import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// Tạo hàm gọi API lấy danh mục
export const fetchCategories = async () => {
  try {

    const response = await axios.get(
      `${Constants.expoConfig?.extra?.API_URL}/categories`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Tạo hàm gọi API thêm danh mục
export const addCategory = async (categoryName: string) => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");

    if (!accessToken || !phpSessId) {
      throw new Error("Không tìm thấy thông tin xác thực.");
    }

    await axios.post(
      `${Constants.expoConfig?.extra?.API_URL}/employee/category/add`,
      { "TenLoaiSanPham": categoryName },
      {
        headers: {
          PHPSESSID: phpSessId,
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
      }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Tạo hàm gọi API sửa danh mục
export const updateCategory = async (categoryId: number, categoryName: string) => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");

    if (!accessToken || !phpSessId) {
      throw new Error("Không tìm thấy thông tin xác thực.");
    }

    const response = await axios.put(
      `${Constants.expoConfig?.extra?.API_URL}/employee/category/update`,
      {
        "IDLoaiSanPham": categoryId,
        "TenLoaiSanPham": categoryName
      },
      {
        headers: {
          PHPSESSID: phpSessId,
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
      }
    );
    
  } catch (error :any) {
    console.error("Error updating category:", error.response.data);
    throw error;
  }
};

// Tạo hàm gọi API xóa danh mục
export const deleteCategory = async (categoryId: number) => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");

    if (!accessToken || !phpSessId) {
      throw new Error("Không tìm thấy thông tin xác thực.");
    }

    const response = await axios.delete(
      `${Constants.expoConfig?.extra?.API_URL}/employee/category/delete`,
      {
        params: {
          id: categoryId, // Đặt vào params thay vì body
        },
        headers: {
          PHPSESSID: phpSessId,
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
      }
    );

  } catch (error :any) {
    console.error("Error deleting category:", error.response.data);
    throw error;
  }
};
