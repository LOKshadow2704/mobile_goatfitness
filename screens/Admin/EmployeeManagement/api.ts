import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const getHeaders = async () => {
  const accessToken = await SecureStore.getItemAsync("access_token");
  const phpSessId = await SecureStore.getItemAsync("phpsessid");
  return {
    PHPSESSID: phpSessId || "",
    Authorization: `Bearer ${accessToken || ""}`,
    "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
  };
};

export const fetchAllEmployees = async () => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/admin/employee/all`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const fetchEmployeeSchedules = async () => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/admin/employee/schedule/all`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employee schedules:", error);
    throw error;
  }
};

export const addEmployeeSchedule = async (data: {
  employee_username: string;
  date: string;
  shift: number;
  note: string;
}) => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(
      `${Constants.expoConfig?.extra?.API_URL}/admin/employee/schedule/add`,
      data,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding schedule:", error);
    throw error;
  }
};
