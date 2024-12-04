import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

// Hàm lấy thông tin token và session
const getHeaders = async () => {
  const accessToken = await SecureStore.getItemAsync("access_token");
  const phpSessId = await SecureStore.getItemAsync("phpsessid");
  return {
    PHPSESSID: phpSessId || "",
    Authorization: `Bearer ${accessToken || ""}`,
    "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
  };
};

// Lấy danh sách Personal Trainers
export const fetchPersonalTrainers = async () => {
  const headers = await getHeaders();
  const response = await axios.get(
    `${Constants.expoConfig?.extra?.API_URL}/admin/personalTrainer/request`,
    { headers }
  );
  return response;
};

// Xác nhận Personal Trainer
export const acceptPersonalTrainer = async (id: number) => {
  const headers = await getHeaders();
  const response = await axios.put(
    `${Constants.expoConfig?.extra?.API_URL}/admin/personalTrainer/request/accept?id=${id}`,
    null,
    { headers }
  );
  return response.data;
};

// Từ chối Personal Trainer
export const rejectPersonalTrainer = async (id: number) => {
  const headers = await getHeaders();
  const response = await axios.delete(
    `${Constants.expoConfig?.extra?.API_URL}/admin/personalTrainer/request/reject?id=${id}`,
    { headers }
  );
  return response.data;
};

export const fetchAllPersonalTrainers = async () => {
    const response = await axios.get(
      `${Constants.expoConfig?.extra?.API_URL}/personalTrainer/all`
    );
    return response.data;
  };
