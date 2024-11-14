import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

interface RegisterPackageModalProps {
  visible: boolean;
  onClose: () => void;
  onRegister: (selectedPackage: any) => void;
  SDT: string | null;
}

const RegisterPackageModal: React.FC<RegisterPackageModalProps> = ({
  visible,
  onClose,
  onRegister,
  SDT,
}) => {
  const [gymPackages, setGymPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [confirmModalVisible, setConfirmModalVisible] =
    useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const fetchGymPackages = async () => {
    try {
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/gympack`
      );
      setGymPackages(response.data);
    } catch (error: any) {
      console.error(
        "Lỗi khi lấy danh sách gói tập:",
        error.response.data.error
      );
    }
  };

  useEffect(() => {
    if (visible && !registrationSuccess) {
      fetchGymPackages();
    }
  }, [visible, registrationSuccess]);

  const handleSelectPackage = (item: any) => {
    setSelectedPackage(item);
  };

  const handleContinue = () => {
    if (selectedPackage) {
      setConfirmModalVisible(true);
    } else {
      alert("Vui lòng chọn gói tập!");
    }
  };

  const handleConfirmRegister = async () => {
    if (selectedPackage) {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      try {
        const response = await axios.post(
          `${Constants.expoConfig?.extra?.API_URL}/employee/gympack/register`,
          {
            IDGoiTap: selectedPackage.IDGoiTap,
            SDT: SDT,
          },
          {
            headers: {
              PHPSESSID: phpSessId,
              Authorization: `Bearer ${accessToken}`,
              "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
            },
          }
        );
        if (response.status === 200) {
          setRegistrationSuccess(true);
          onRegister(selectedPackage);
          setConfirmModalVisible(false);
        }
      } catch (error: any) {
        console.error("Lỗi khi đăng ký gói tập:", error.response?.data?.error);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Đăng ký Gói Tập</Text>
          <Text>Bạn có muốn đăng ký gói tập cho người dùng này?</Text>

          {/* Sử dụng FlatList để tạo danh sách các gói tập */}
          <FlatList
            data={gymPackages}
            keyExtractor={(item) => item.IDGoiTap.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.packageItem,
                  selectedPackage?.IDGoiTap === item.IDGoiTap &&
                    styles.selectedPackage,
                ]}
                onPress={() => handleSelectPackage(item)}
              >
                <Text>{`${item.TenGoiTap} - ${
                  item.ThoiHan
                } ngày - ${item.Gia.toLocaleString()} VND`}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal xác nhận */}
      {confirmModalVisible && (
        <Modal visible={confirmModalVisible} transparent animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Xác Nhận Đăng Ký</Text>
              <Text>
                Bạn có chắc chắn muốn đăng ký gói tập{" "}
                {selectedPackage?.TenGoiTap} cho người dùng này không?
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmRegister}
                >
                  <Text style={styles.buttonText}>Xác Nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    backgroundColor: "#FF7777",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  packageItem: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  selectedPackage: {
    backgroundColor: "#FF7777",
  },
});

export default RegisterPackageModal;
