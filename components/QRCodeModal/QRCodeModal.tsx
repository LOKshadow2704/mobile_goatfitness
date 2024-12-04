import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Button, Text } from "native-base";
import uuid from "react-native-uuid";

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
}) => {
  const [userQRCodeData, setUserQRCodeData] = useState<string>("");

  useEffect(() => {
    if (visible) {
      try {
        const deviceId = uuid.v4();
        const combinedData = {deviceId };
        setUserQRCodeData(JSON.stringify(combinedData));
        console.log(JSON.stringify(combinedData));
      } catch (error) {
        console.error("Lỗi khi phân tích cú pháp userInfo:", error);
      }
    }
  }, [visible]);

  if (!userQRCodeData) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.qrContainer}>
          <Text style={styles.title}>Mã QR Check In</Text>
          <QRCode value={userQRCodeData} size={200} />
          <Button mt={4} onPress={onClose} style={styles.closeButton}>
            <Text color="white">Đóng</Text>
          </Button>
        </View>
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
    width: 320,
    height: 320,
    backgroundColor: "white",
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
  closeButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default QRCodeModal;
