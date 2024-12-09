import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  Text,
  VStack,
  Modal,
} from "native-base";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { Keyboard, RefreshControl, ScrollView, StyleSheet } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import ChangePasswordModal from "@/components/ChangePasswordModal/ChangePasswordModal";
import { userLogout } from "@/redux/actions/authActions";
import PersonalTrainerSchedule from "@/components/PersonalTrainerSchedule/PersonalTrainerSchedule";

const UserScreen: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showTrainerScheduleModal, setShowTrainerScheduleModal] =
    useState(false);
  const [userData, setUserData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const inputRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const route = useRouter();
  const dispatch = useDispatch();

  const handleKeyboardDidHide = () => {
    if (isFocused) {
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleLogout = async () => {
    try {
      await userLogout()(dispatch);
      setShowLogoutModal(true);
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      setShowLogoutModal(true);
    }
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    route.push("/");
  };

  const handleUpdate = async () => {
    const updatedData = Object.keys(userData).reduce((acc: any, key) => {
      if (userData[key] !== originalData[key]) {
        acc[key] = userData[key];
      }
      return acc;
    }, {});

    if (Object.keys(updatedData).length === 0) {
      setUpdateMessage("Không có thay đổi nào để cập nhật.");
      setShowUpdateModal(true);
      return;
    }

    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");
      const response = await axios.put(
        `${Constants.expoConfig?.extra?.API_URL}/user/update`,
        updatedData,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );
      if (response.status === 200) {
        setUpdateMessage("Cập nhật thành công!");
        fetchUserInfo();
      } else {
        throw new Error(
          `Cập nhật thất bại với mã trạng thái: ${response.status}`
        );
      }

      setShowUpdateModal(true);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      setUpdateMessage("Cập nhật thất bại. Vui lòng thử lại.");
      setShowUpdateModal(true);
    }
  };

  const handleChange = (field: string, value: string) => {
    setUserData((prevData: any) => ({ ...prevData, [field]: value }));
  };

  const fetchUserInfo = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/user/Info`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );

      setUserData(response.data);
      setOriginalData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserInfo();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserInfo();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardDidHide
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [isFocused]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Box width="100%" alignItems="flex-start" paddingY={2}>
        <Heading size="md" textAlign="left">
          Thông tin tài khoản
        </Heading>
      </Box>
      <Box style={styles.avt_box}>
        <Image
          source={{ uri: userData.avt || "https://i.imgur.com/v4Y8e4G.jpg" }}
          alt="Avatar"
          style={styles.image}
        />
      </Box>
      <Heading p={4} size={"md"}>
        {userData.HoTen || "Tên người dùng"}
      </Heading>

      {userData.IDHLV && (
        <Box w="100%" bg="blue.100" p={4} borderRadius="md">
          <Text fontWeight="bold" color="blue.600">
            Huấn luyện viên - Personal Trainer
          </Text>
          <Button
            mt={2}
            colorScheme="blue"
            onPress={() => setShowTrainerScheduleModal(true)}
          >
            Xem lịch tập
          </Button>
        </Box>
      )}

      <VStack w={"100%"} space={4}>
        {[
          { label: "Số điện thoại:", field: "SDT", placeholder: "Nhập số điện thoại" },
          { label: "Email:", field: "Email", placeholder: "Nhập email" },
          { label: "Địa chỉ:", field: "DiaChi", placeholder: "Nhập địa chỉ" },
        ].map(({ label, field, placeholder }) => (
          <Box width="100%" key={field}>
            <Text p={1} pl={2} fontWeight="bold">
              {label}
            </Text>
            <Input
              fontSize="14px"
              px={5}
              style={styles.input_background}
              value={userData[field] || ""}
              placeholder={placeholder}
              onChangeText={(value) => handleChange(field, value)}
              variant="rounded"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </Box>
        ))}
        <Button onPress={handleUpdate}>Cập nhật thông tin</Button>
        <Button onPress={() => setShowChangePasswordModal(true)}>
          Đổi mật khẩu
        </Button>
        <Button onPress={handleLogout} colorScheme="red">
          Đăng xuất
        </Button>
      </VStack>

      {/* Modals */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Đăng xuất</Modal.Header>
          <Modal.Body>
            <Text>Bạn có chắc chắn muốn đăng xuất không?</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group>
              <Button onPress={() => setShowLogoutModal(false)}>Hủy</Button>
              <Button onPress={handleConfirmLogout} colorScheme="danger">
                Đăng xuất
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Kết quả cập nhật</Modal.Header>
          <Modal.Body>
            <Text>{updateMessage}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={() => setShowUpdateModal(false)}>OK</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onChangePassword={(oldPassword, newPassword) => {
          console.log("Mật khẩu cũ:", oldPassword);
          console.log("Mật khẩu mới:", newPassword);
        }}
      />

      <PersonalTrainerSchedule
        isOpen={showTrainerScheduleModal}
        onClose={() => setShowTrainerScheduleModal(false)}
      />
      <Box pb={100}></Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  avt_box: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input_background: {
    backgroundColor: "#f5f5f5",
  },
});

export default UserScreen;
