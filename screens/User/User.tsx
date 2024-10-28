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
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

interface UserData {
  TenDangNhap: string;
  IDVaiTro: number;
  HoTen: string;
  DiaChi: string;
  Email: string;
  SDT: string;
  TrangThai: string;
  avt: string;
  TenVaiTro: string;
}

const UserScreen = () => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const route = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserData | null>(null);
  const handleKeyboardDidHide = () => {
    if (isFocused) {
      // Gỡ bỏ focus khỏi Input
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };
  const handleLogout = async () => {
    try {
      await userLogout()(dispatch);
      Alert.alert("Đăng xuất thành công", "", [
        {
          text: "OK",
          onPress: () => {
            route.push("/");
          },
        },
      ]);
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      Alert.alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");
    try {
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
      setData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardDidHide
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, [isFocused]);
  return (
    <View style={styles.container}>
      <Box width="100%" alignItems="flex-start" paddingY={2}>
        <Heading size="md" textAlign="left">
          Thông tin tài khoản
        </Heading>
      </Box>
      <Box style={styles.avt_box}>
        <Image
          source={{ uri: data?.avt || 'https://i.imgur.com/placeholder.jpg' }}  // Sử dụng avatar từ data
          alt="Avatar"
          style={styles.image}
        />
      </Box>
      <Heading p={4} size={"md"}>
        {data?.HoTen}
      </Heading>
      <VStack w={"100%"} space={4}>
        <Box width="100%">
          <Text p={1} pl={2} fontWeight="bold">
            Tên đăng nhập:
          </Text>
          <Input
            fontSize="14px"
            px={5}
            style={styles.input_background}
            value={data?.TenDangNhap}
            variant="rounded"
            isReadOnly // Chỉ đọc
          />
        </Box>
  
        <Box width="100%">
          <Text p={1} pl={2} fontWeight="bold">
            Số điện thoại:
          </Text>
          <Input
            fontSize="14px"
            px={5}
            style={styles.input_background}
            value={data?.SDT}
            variant="rounded"
            isReadOnly
          />
        </Box>
  
        <Box width="100%">
          <Text p={1} pl={2} fontWeight="bold">
            Mail:
          </Text>
          <Input
            fontSize="14px"
            px={5}
            style={styles.input_background}
            value={data?.Email}
            variant="rounded"
            isReadOnly
          />
        </Box>
  
        <Box width="100%">
          <Text p={1} pl={2} fontWeight="bold">
            Địa chỉ:
          </Text>
          <Input
            fontSize="14px"
            px={5}
            style={styles.input_background}
            value={data?.DiaChi}
            variant="rounded"
            isReadOnly
          />
        </Box>
  
        <Box width="100%">
          <Text p={1} pl={2} fontWeight="bold">
            Trạng thái:
          </Text>
          <Input
            fontSize="14px"
            px={5}
            style={styles.input_background}
            value={data?.TrangThai}
            variant="rounded"
            isReadOnly
          />
        </Box>
        
        <Button onPress={handleLogout}>Đăng xuất</Button>
      </VStack>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
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
