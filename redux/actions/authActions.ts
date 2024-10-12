import { Dispatch } from 'redux';
import axios from 'axios';
import { authConstants } from '../constants/authConstants';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

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
  phpsessid: string;
  user: User;
}

// Hàm login
export const login = (username: string, password: string) => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: authConstants.LOGIN_REQUEST });
  try {
    const response: ApiResponse = await ApiLogin(username, password); // Đảm bảo kiểu dữ liệu đúng
    const user = response.user;

    // Lưu token vào SecureStore
    await SecureStore.setItemAsync('access_token',response.access_token);
    await SecureStore.setItemAsync('refresh_token',response.refresh_token);
    await SecureStore.setItemAsync('phpsessid',response.phpsessid);

    // Lưu thông tin người dùng vào AsyncStorage (hoặc bạn có thể dùng SecureStore)
    await SecureStore.setItemAsync('user', JSON.stringify(user));

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
  const userData = await SecureStore.getItemAsync('user'); // Thay đổi để lấy user từ SecureStore
  const accessToken = await SecureStore.getItemAsync('access_token');

  if (userData && accessToken) {
    const user: User = JSON.parse(userData);
    dispatch({
      type: authConstants.LOGIN_SUCCESS,
      payload: { user }
    });
  }
};

// Hàm đăng xuất
export const userLogout = () => async (dispatch: Dispatch): Promise<void> => {
  try {
    const accessToken = await SecureStore.getItemAsync('access_token');
    const phpsessid = await SecureStore.getItemAsync('phpsessid');
    console.log(accessToken +"," + phpsessid)
    const response = await axios.get(`${API_URL}/logout`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Gửi access_token
        'PHPSESSID': phpsessid // Gửi phpsessid
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
    console.log('Sending request to server with:', { username, password });

    const response = await axios.post<ApiResponse>(`${API_URL}/login`, {
      username,
      password,
    }, {
      withCredentials: true,
      headers: {
        'User-Agent': 'MOBILE_GOATFITNESS',
      }
    });

    console.log('Response Data:', response.data);
    return response.data; // Đảm bảo rằng phản hồi chứa đủ thuộc tính
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
