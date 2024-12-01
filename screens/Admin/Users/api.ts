import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// API base URL
const apiUrl = `${Constants.expoConfig?.extra?.API_URL}`;

// Helper function to get authentication tokens
const getAuthHeaders = async () => {
  const accessToken = await SecureStore.getItemAsync('access_token');
  const phpSessId = await SecureStore.getItemAsync('phpsessid');
  return {
    headers: {
      PHPSESSID: phpSessId,
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': `${Constants.expoConfig?.extra?.AGENT}`,
    },
  };
};

// Fetch all users
export const getUsers = async () => {
  const response = await axios.get(`${apiUrl}/admin/account/all`, await getAuthHeaders());
  return response.data;
};

// Add a new user
export const addUser = async (userData: {
  username: string;
  fullname: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role_id: number;
  epl_description?: string; // Optional, for employees
}) => {
  const { username, fullname, address, email, phone, password, confirmPassword, role_id, epl_description } = userData;

  // API yêu cầu một số trường cụ thể, nên cần chuyển đổi dữ liệu
  const dataToSend = {
    username: username,
    fullname: fullname,
    address: address,
    phone: phone,
    email: email,
    password: password,
    role_id: role_id, // IDVaiTro, có thể là 2 hoặc 3
    epl_description: epl_description || "", // IDHLV nếu là nhân viên
  };

  // Nếu mật khẩu và xác nhận mật khẩu không khớp, không gửi yêu cầu
  if (password !== confirmPassword) {
    throw new Error('Mật khẩu và xác nhận mật khẩu không khớp!');
  }

  const response = await axios.post(`${apiUrl}/admin/account/add`, dataToSend, await getAuthHeaders());
  console.log(response.data)
  return response;
};

// Update user role
export const updateUserRole = async (userId: string, newRole: number) => {
  const response = await axios.put(`${apiUrl}/admin/role/update`, {
    "IDVaiTro": newRole,
    "TenDangNhap": userId
  }, await getAuthHeaders());
  return response;
};

// Delete user
export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${apiUrl}/admin/account/delete?un=${userId}`, await getAuthHeaders());
  return response;
};
