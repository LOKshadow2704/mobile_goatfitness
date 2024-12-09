import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Button, Text } from "native-base";
import uuid from "react-native-uuid";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ visible, onClose }) => {
  const [userQRCodeData, setUserQRCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        // Lấy access token và phpSessId từ SecureStore
        const accessToken = await SecureStore.getItemAsync("access_token");
        const phpSessId = await SecureStore.getItemAsync("phpsessid");

        // Kiểm tra xem deviceId đã được lưu trong SecureStore chưa
        let deviceId = await SecureStore.getItemAsync("device_id");

        // Nếu chưa có deviceId thì tạo mới và lưu vào SecureStore
        if (!deviceId) {
          deviceId = uuid.v4(); // Tạo deviceId mới nếu chưa có
          await SecureStore.setItemAsync("device_id", deviceId);
        }

        // Lấy thông tin người dùng từ API
        const headers = {
          PHPSESSID: phpSessId || "",
          Authorization: `Bearer ${accessToken || ""}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        };

        const response = await axios.get(
          `${Constants.expoConfig?.extra?.API_URL}/user/Info`,
          { headers }
        );

        const { TenDangNhap } = response.data;

        // Kết hợp dữ liệu người dùng và deviceId
        const combinedData = {
          TenDangNhap,
          deviceId,
        };

        // Chuyển đổi đối tượng thành chuỗi JSON
        setUserQRCodeData(JSON.stringify(combinedData)); // Cập nhật dữ liệu mã QR
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu người dùng hoặc mã QR");
        console.error("Lỗi khi gọi API hoặc phân tích dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchUserInfo();
    }
  }, [visible]);

  if (loading) {
    return (
      <Modal transparent visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal transparent visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={onClose} style={styles.closeButton}>
            <Text color="white">Đóng</Text>
          </Button>
        </View>
      </Modal>
    );
  }

  if (!userQRCodeData) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.qrContainer}>
          <Text style={styles.title}>Mã QR ra vào</Text>
          <Text style={styles.note}>
            Vui lòng không cung cấp cho ai
          </Text>
          <QRCode value={userQRCodeData} size={200} />
          <Button mt={4} onPress={onClose} style={styles.closeButton}>
            <Text color="white">Đóng</Text>
          </Button>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  qrContainer: {
    width: 350, // Đã điều chỉnh để modal rộng hơn
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  note: {
    marginBottom: 20,
    fontSize: 14,
    color: "#f00",
    fontStyle: "italic",
  },
  closeButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default QRCodeModal;
