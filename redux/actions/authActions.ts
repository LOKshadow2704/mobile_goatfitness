import { Dispatch } from 'redux';
import axios from 'axios';
import { authConstants } from '../constants/authConstants';
import * as SecureStore from 'expo-secure-store';
import Constants from "expo-constants";

// Định nghĩa kiểu cho User và phản hồi từ API
interface User {
  TenDangNhap: string;
  IDVaiTro: number;
  HoTen: string;
  DiaChi: string;
  Email: string;
  SDT: string;
  TrangThai: string;
  avt: string;
  TenVaiTro: string;
}

// Định nghĩa kiểu phản hồi API
interface ApiResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
  phpsessid: string;
  user: User;
}

// Hàm login
export const login = (username: string, password: string) => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: authConstants.LOGIN_REQUEST });
  try {
    const response: ApiResponse = await ApiLogin(username, password); // Đảm bảo kiểu dữ liệu đúng
    const user = response.user;
    await SecureStore.setItemAsync('access_token', response.access_token);
    await SecureStore.setItemAsync('refresh_token', response.refresh_token);
    await SecureStore.setItemAsync('phpsessid', response.phpsessid);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    console.log(response)
    // Dispatch action thành công
    dispatch({
      type: authConstants.LOGIN_SUCCESS,
      payload: { user }
    });
  } catch (error) {
    // Xử lý lỗi
    if (error instanceof Error) {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: error.message
      });
    } else {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: 'An unexpected error occurred'
      });
    }
  }
};

// Hàm tự động đăng nhập
export const autoLogin = () => async (dispatch: Dispatch): Promise<void> => {
  try {
    // Lấy refresh token và user từ SecureStore
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    const userJson = await SecureStore.getItemAsync('user');
    const user: User | null = userJson ? JSON.parse(userJson) : null;

    // Kiểm tra nếu refresh token và user tồn tại
    if (refreshToken && user && user.TenDangNhap) {
      const url = `${Constants.expoConfig?.extra?.API_URL}/login/refresh-token`;
      const fetchData = await axios.post(url, {
        refresh_token: refreshToken,
        username: user.TenDangNhap,
      }, {
        withCredentials: true,
        headers: {
          'User-Agent': 'MOBILE_GOATFITNESS',
        },
      });

      const response = fetchData.data; // Đảm bảo sử dụng phản hồi từ Axios
      const updatedUser = response.user; // Lấy thông tin người dùng cập nhật từ phản hồi

      // Lưu trữ lại các thông tin mới
      await SecureStore.setItemAsync('access_token', response.access_token);
      await SecureStore.setItemAsync('refresh_token', response.refresh_token);
      await SecureStore.setItemAsync('phpsessid', response.phpsessid);
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));

      // Dispatch action đăng nhập thành công
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: { user: updatedUser },
      });
    }
  } catch (error: unknown) {
    // Kiểm tra nếu lỗi là Axios error
    if (axios.isAxiosError(error)) {
      console.log('Axios Error Details:', error.response);
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: error.response?.data?.error || 'Failed to refresh token. Please log in again.',
      });
    } else if (error instanceof Error) {
      console.error('Error Message:', error.message);
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: error.message,
      });
    } else {
      console.error('Unexpected Error:', error);
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: 'An unexpected error occurred. Please try again.',
      });
    }
  }
};


// Hàm đăng xuất
export const userLogout = () => async (dispatch: Dispatch): Promise<void> => {
  try {
    const accessToken = await SecureStore.getItemAsync('access_token');
    const phpsessid = await SecureStore.getItemAsync('phpsessid');
    const response = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/logout`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`, // Gửi access_token
        'PHPSESSID': phpsessid,// Gửi phpsessid
        'User-Agent': "MOBILE_GOATFITNESS"
      }
    });
    if (response.status === 200) {
      // Xóa token khỏi SecureStore
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('phpsessid');
      dispatch({
        type: authConstants.LOGOUT
      });
    } else {
      console.error('Đăng xuất thất bại từ server:', response.data);
      throw new Error('Đăng xuất thất bại. Vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Lỗi khi gọi API đăng xuất:', error);
    throw new Error('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
  }
};

// API function using axios
const ApiLogin = async (username: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${Constants.expoConfig?.extra?.API_URL}/login`, {
      username,
      password,
    }, {
      withCredentials: true,
      headers: {
        'User-Agent': 'MOBILE_GOATFITNESS',
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Details:');

      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        console.error('Response Headers:', error.response.headers);
        throw new Error(error.response.data.message || 'Invalid username or password');
      } else if (error.request) {
        console.error('Request Data:', error.request);
        throw new Error('Network error');
      } else {
        console.error('Error Message:', error.message);
        throw new Error('An unexpected error occurred');
      }
    } else if (error instanceof Error) {
      console.error('Error Message:', error.message);
      throw new Error('An unexpected error occurred');
    } else {
      console.error('Unexpected Error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};
