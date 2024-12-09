import React, { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

export default function QRScanScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Chúng tôi cần quyền truy cập camera để quét mã QR.
        </Text>
        <Button onPress={requestPermission} title="Cấp quyền" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: any }) => {
    data = JSON.parse(data);
    if (hasScanned) return; // Nếu đã quét rồi, không quét tiếp

    setHasScanned(true); // Đánh dấu là đã quét

    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      const headers = {
        PHPSESSID: phpSessId,
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
      };

      const body = {
        username: data.TenDangNhap,
        id_device: data.deviceId,
      };

      const response = await axios.post(
        `${Constants.expoConfig?.extra?.API_URL}/employee/user/checkin`,
        body,
        {
          headers,
        }
      );

      if (response.data.success) {
        let message = response.data.success;
        if (response.data.price) {
          message += ` - Giá: ${response.data.price} VND`;
        }

        Alert.alert("Check-in thành công", message, [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                setHasScanned(false); // Cho phép quét lại
              }, 2000);
            },
          },
        ]);
      } else {
        Alert.alert("Lỗi", response.data, [
          {
            text: "OK",
            onPress: () => {
              // Đặt lại trạng thái đã quét sau 2 giây
              setTimeout(() => {
                setHasScanned(false); // Cho phép quét lại
              }, 2000);
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error("Lỗi khi gửi yêu cầu API:", error.response?.data || error);
      Alert.alert(
        "Lỗi kết nối",
        "Không thể kết nối với máy chủ. Vui lòng kiểm tra lại kết nối mạng.",
        [
          {
            text: "OK",
            onPress: () => {
              // Đặt lại trạng thái đã quét sau 2 giây
              setTimeout(() => {
                setHasScanned(false); // Cho phép quét lại
              }, 2000);
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={handleBarCodeScanned}
        facing={facing}
      >
        {/* Overlay làm mờ xung quanh ô vuông */}
        <View style={styles.overlay}>
          {/* Các vùng làm mờ xung quanh ô vuông */}
          <View style={[styles.overlayBlur, styles.topBlur]} />
          <View style={[styles.overlayBlur, styles.bottomBlur]} />
          <View style={[styles.overlayBlur, styles.leftBlur]} />
          <View style={[styles.overlayBlur, styles.rightBlur]} />
          <View style={styles.square} />
        </View>
      </CameraView>

      <TouchableOpacity style={styles.goBack} onPress={() => router.back()}>
        <Text style={styles.goBackText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderStyle: "dashed",
    borderRadius: 10,
  },
  overlayBlur: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  topBlur: {
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
  },
  bottomBlur: {
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
  },
  leftBlur: {
    top: "30%",
    bottom: "30%",
    left: 0,
    width: "10%",
  },
  rightBlur: {
    top: "30%",
    bottom: "30%",
    right: 0,
    width: "10%",
  },
  goBack: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  goBackText: {
    color: "#000",
    fontWeight: "bold",
  },
});
