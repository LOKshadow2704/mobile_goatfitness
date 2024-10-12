import React, { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function QRScanScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
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

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    Alert.alert("Mã QR đã quét", `Nội dung: ${data}`);
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

          {/* Ô vuông chính giữa */}
          <View style={styles.square} />
        </View>
      </CameraView>

      {/* Nút Quay lại */}
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
