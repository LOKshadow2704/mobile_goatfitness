import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import để điều hướng với Expo Router
import { VStack } from "native-base";
import * as SecureStore from "expo-secure-store";

// Cập nhật lại interface để phù hợp với dữ liệu API
interface GymPackage {
  id: number; // Sử dụng IDGoiTap từ API
  name: string; // Sử dụng TenGoiTap từ API
  price: number | null; // Sử dụng Gia từ API
}

const UpdateGymPackageScreen = () => {
  const [gymPackages, setGymPackages] = useState<GymPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<GymPackage | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null); // Thêm trạng thái thông báo thành công
  const [updateError, setUpdateError] = useState<string | null>(null); // Thêm trạng thái thông báo lỗi

  const router = useRouter(); // Sử dụng Expo Router

  const fetchGymPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/gympack`
      );
      if (response.status === 200) {
        const transformedData = response.data.map((item: any) => ({
          id: item.IDGoiTap,
          name: item.TenGoiTap,
          price: item.Gia || null,
        }));
        setGymPackages(transformedData);
      }
    } catch (error: any) {
      setError("Lỗi khi lấy danh sách gói tập.");
      console.log("Lỗi khi lấy danh sách gói tập:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async () => {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");

    if (selectedPackage) {
      const price = parseFloat(newPrice.replace(/,/g, '')); // Loại bỏ dấu phẩy nếu có
      if (newPrice.trim() === "") {
        setUpdateError("Giá không được để trống.");
        return;
      }
      if (price === selectedPackage.price) {
        setUpdateError("Giá mới phải khác giá hiện tại.");
        return;
      }
      if (isNaN(price)) {
        setUpdateError("Giá không hợp lệ.");
        return;
      }

      try {
        const response = await axios.put(
          `${Constants.expoConfig?.extra?.API_URL}/employee/gympack/price/update`,
          {
            IDGoiTap: selectedPackage.id,
            Gia: price,
          },
          {
            headers: {
              PHPSESSID: phpSessId,
              Authorization: `Bearer ${accessToken}`,
              "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
            },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          setModalVisible(false);
          setUpdateSuccess("Cập nhật giá thành công!"); // Thông báo thành công
          fetchGymPackages();
        }
      } catch (error: any) {
        setUpdateError("Lỗi khi cập nhật giá."); // Thông báo lỗi
        console.error("Lỗi khi cập nhật giá:", error.response?.data);
      }
    }
  };

  useEffect(() => {
    fetchGymPackages();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077b6" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="exit-to-app" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cập nhật giá gói tập</Text>
      </View>

      <FlatList
        data={gymPackages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedPackage(item);
              setNewPrice(item.price !== null ? item.price.toString() : ""); // Kiểm tra null và undefined
              setModalVisible(true);
            }}
            style={styles.packageItem}
          >
            <Text style={styles.packageText}>{item.name}</Text>
            <Text style={styles.packageText}>
              Giá:{" "}
              {item.price !== null && item.price !== undefined
                ? item.price.toLocaleString()
                : "N/A"}{" "}
              VND
            </Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Cập nhật giá cho {selectedPackage?.name}
            </Text>
            <TextInput
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
              placeholder="Nhập giá mới"
              style={styles.input}
            />
            <VStack space={2}>
              <Button title="Cập nhật" onPress={updatePrice} color="#0077b6" />
              <Button
                title="Hủy"
                onPress={() => setModalVisible(false)}
                color="#FF0000"
              />
            </VStack>
          </View>
        </View>
      </Modal>

      {/* Modal thông báo */}
      <Modal
        visible={updateSuccess !== null || updateError !== null}
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{
                ...styles.modalTitle,
                color: updateError ? "#FF0000" : "#0077b6",
              }}
            >
              {updateSuccess || updateError}
            </Text>
            <Button
              title="Đóng"
              onPress={() => {
                setUpdateSuccess(null);
                setUpdateError(null);
              }}
              color="#0077b6"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f9ff", // Màu nền theo yêu cầu
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center", // Căn giữa theo chiều dọc
    justifyContent: "flex-start", // Phân phối không gian giữa nút và tiêu đề
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#0077b6", // Màu xanh
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0077b6",
    textAlign: "center",
    flex: 1,
  },
  packageItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#0077b6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  packageText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderColor: "#0077b6",
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#0077b6",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UpdateGymPackageScreen;
