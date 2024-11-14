import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

interface ConfirmPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void; // callback khi xác nhận thành công
  IDHoaDon: number | null; // ID của gói tập cần xác nhận thanh toán
}

const ConfirmPaymentModal: React.FC<ConfirmPaymentModalProps> = ({
  visible,
  onClose,
  onConfirm,
  IDHoaDon,
}) => {
  const handleConfirm = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      if (!accessToken || !phpSessId) {
        console.error("Thiếu access token hoặc PHP session ID.");
        return;
      }

      const response = await axios.put(
        `${Constants.expoConfig?.extra?.API_URL}/employee/gympack/payment/confirm`,
        { IDHoaDon: IDHoaDon },
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );

      if (response.status === 200) {
        onConfirm(); 
      } else {
        console.error("Xác nhận thanh toán thất bại", response.status);
      }
    } catch (error: any) {
      console.error("Lỗi khi xác nhận thanh toán:", error.response?.data);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Xác nhận Thanh Toán</Text>
          <Text>Bạn đã nhận tiền từ người dùng?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Xác Nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  confirmButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ConfirmPaymentModal;
