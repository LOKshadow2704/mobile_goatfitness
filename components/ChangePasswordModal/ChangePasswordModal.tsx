import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  Center,
  Text,
  FormControl,
  WarningOutlineIcon,
} from "native-base";
import { StyleSheet } from "react-native";

import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import axios from "axios";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (oldPassword: string, newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onChangePassword,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePassword = async () => {
    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không trùng khớp.");
      return;
    }

    if (!newPassword || !oldPassword || !confirmNewPassword) {
      setErrorMessage("Vui lòng nhập đầy đủ các trường.");
      return;
    }

    setErrorMessage(""); // Reset lỗi nếu không có lỗi

    try {
      const result = await updatePassword(oldPassword, newPassword);
      if (result.success) {
        alert(result.message);
        onChangePassword(oldPassword, newPassword); // Tiến hành callback nếu thành công
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        onClose(); // Đóng modal sau khi thành công
      } else {
        setErrorMessage(result.message); // Hiển thị thông báo lỗi từ API nếu có
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const updatePassword = async (currentPW: string, newPW: string) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      const response = await axios.put(
        `${Constants.expoConfig?.extra?.API_URL}/user/updatePW`, // API endpoint
        { currentPW: currentPW, newPW: newPW },
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );

      if (response.status === 200) {
        return { success: true, message: "Cập nhật mật khẩu thành công!" };
      } else {
        throw new Error(
          `Cập nhật thất bại với mã trạng thái: ${response.status}`
        );
      }
    } catch (error: any) {
      return { success: false, message: error.message || "Có lỗi xảy ra." };
    }
  };

  return (
    <Center>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <Modal.Content maxWidth="400px" bg="white">
          <Modal.CloseButton />
          <Modal.Header>Đổi mật khẩu</Modal.Header>
          <Modal.Body>
            {/* Mật khẩu cũ */}
            <FormControl isInvalid={!!errorMessage}>
              <FormControl.Label>Mật khẩu hiện tại</FormControl.Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                value={oldPassword}
                onChangeText={setOldPassword}
                style={styles.input}
              />
            </FormControl>

            {/* Mật khẩu mới */}
            <FormControl isInvalid={!!errorMessage}>
              <FormControl.Label>Mật khẩu mới</FormControl.Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
              />
            </FormControl>

            {/* Xác nhận mật khẩu mới */}
            <FormControl isInvalid={!!errorMessage}>
              <FormControl.Label>Xác nhận mật khẩu mới</FormControl.Label>
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                style={styles.input}
              />
            </FormControl>

            {/* Thông báo lỗi */}
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </Modal.Body>

          {/* Nút hành động */}
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={onClose}>
                Hủy
              </Button>
              <Button colorScheme="primary" onPress={handleChangePassword}>
                Đổi mật khẩu
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
  },
});

export default ChangePasswordModal;
