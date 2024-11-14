import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "native-base";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const SuccessScreen: React.FC = () => {
  const route = useRouter();
  const { orderCode } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<any>(null);
  const [statusColor, setStatusColor] = useState<string>("#4CAF50"); // Màu mặc định xanh lá

  useEffect(() => {
    const postPaymentDetails = async () => {
      setLoading(true);
      try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        const phpSessId = await SecureStore.getItemAsync("phpsessid");
        const response = await axios.post(
          `${Constants.expoConfig?.extra?.API_URL}/personalTrainer/payment`,
          { orderCode: orderCode },
          {
            headers: {
              PHPSESSID: phpSessId,
              Authorization: `Bearer ${accessToken}`,
              "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
            },
          }
        );
        console.log(response.data)

        const { status } = response.data; // Lấy trạng thái từ phản hồi

        // Xử lý các trạng thái khác nhau
        switch (status) {
          case "PAID":
            setPaymentStatus("Đã thanh toán!");
            setIsSuccess(true);
            setImageSource(require("@/assets/images/check_mark.png"));
            setStatusColor("#4CAF50"); // Màu xanh lá
            break;
          case "PENDING":
          case "PROCESSING":
            setPaymentStatus("Đang xử lý...");
            setIsSuccess(false);
            setImageSource(null); // Không cần icon, sẽ hiển thị spinner
            setStatusColor("#FFA500"); // Màu vàng cho trạng thái đang xử lý
            break;
          case "CANCELLED":
            setPaymentStatus("Giao dịch đã bị hủy.");
            setIsSuccess(false);
            setImageSource(require("@/assets/images/error_icon.png")); // Hình ảnh cho trạng thái hủy
            setStatusColor("red"); // Màu đỏ cho trạng thái hủy
            break;
          default:
            setPaymentStatus("Trạng thái không xác định.");
            setIsSuccess(false);
            setImageSource(require("@/assets/images/error_icon.png")); // Hình ảnh cho lỗi
            setStatusColor("gray"); // Màu xám cho trạng thái không xác định
            break;
        }
      } catch (err) {
        setIsSuccess(false);
        setImageSource(require("@/assets/images/error_icon.png")); // Hình ảnh cho lỗi
        setStatusColor("red"); // Màu đỏ cho lỗi
      } finally {
        setLoading(false);
      }
    };

    postPaymentDetails();
  }, [orderCode]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={styles.loadingIndicator}
        />
      ) : (
        <Image source={imageSource} alt="Status Icon" style={styles.image} />
      )}
      {loading ? (
        <Text style={styles.loadingText}>Đang xử lý...</Text>
      ) : (
        <Text style={[styles.title, { color: statusColor }]}>
          {paymentStatus}
        </Text>
      )}
      <Text style={styles.description}>Cảm ơn bạn đã sử dụng dịch vụ</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={() => route.push("/Home")}
      >
        <Text style={styles.buttonText}>Về Trang Chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f7f7f7",
    paddingVertical: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 20,
    color: "#4CAF50",
    marginVertical: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    height: 80,
    width: 80,
    marginBottom: 20,
  },
  loadingIndicator: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SuccessScreen;
