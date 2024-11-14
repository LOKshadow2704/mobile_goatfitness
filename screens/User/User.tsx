import { userLogout } from "@/redux/actions/authActions";
import axios from "axios";
import { useRouter } from "expo-router";
import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  Text,
  View,
  VStack,
  Modal,
  Center,
} from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, RefreshControl, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import ChangePasswordModal from "@/components/ChangePasswordModal/ChangePasswordModal";
import { ScrollView } from "react-native-gesture-handler";

const UserScreen = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const inputRef = useRef(null);
  const route = useRouter();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const scrollViewRef = useRef<ScrollView>(null);

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
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > 300);
  };

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
      onScroll={handleScroll}
      scrollEventThrottle={16}
      
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

      <VStack w={"100%"} space={4}>
        {[
          {
            label: "Số điện thoại:",
            field: "SDT",
            placeholder: "Nhập số điện thoại",
          },
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

      {/* Modal xác nhận đăng xuất */}
      <Center>
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        >
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Đăng xuất</Modal.Header>
            <Modal.Body>
              <Text>Bạn có chắc chắn muốn đăng xuất không?</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => setShowLogoutModal(false)}
                >
                  Hủy
                </Button>
                <Button colorScheme="danger" onPress={handleConfirmLogout}>
                  Đăng xuất
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>

      {/* Modal thông báo kết quả cập nhật */}
      <Center>
        <Modal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        >
          <Modal.Content maxWidth="400px">
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
      </Center>

      {/* Modal đổi mật khẩu */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onChangePassword={(oldPassword, newPassword) => {
          console.log("Mật khẩu cũ:", oldPassword);
          console.log("Mật khẩu mới:", newPassword);
          // Xử lý thay đổi mật khẩu tại đây
        }}
      />
      <Box mb={100}></Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  avt_box: {
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginTop: 16,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  input_background: {
    backgroundColor: "white",
  },
});

export default UserScreen;
