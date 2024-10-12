import { userLogout } from "@/redux/actions/authActions";
import axios from "axios";
import { useRouter } from "expo-router";
import { Box, Button, Heading, Image, Input, Text, View, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch } from "react-redux"; 

const UserScreen = () => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const route = useRouter();
  const dispatch = useDispatch();
  const data = {
    fullname: "Nguyễn Thành Lộc",
    address: "H.Cao Lãnh, Tỉnh Đồng Tháp",
    email: "nguyenlocface@gmail.com",
    phone: "0123123123",
  };
  const handleKeyboardDidHide = () => {
    if (isFocused) {
      // Gỡ bỏ focus khỏi Input
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };
  const handleLogout = async () => {
    try {
      await userLogout()(dispatch); // Gọi userLogout và truyền dispatch vào
      Alert.alert("Đăng xuất thành công", "", [
        {
          text: "OK",
          onPress: () => {
            route.push("/"); // Chuyển hướng về màn hình Welcome
          },
        },
      ]);
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      Alert.alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };
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
    <View style={styles.container}>
      <Box width="100%" alignItems="flex-start" paddingY={2}>
        <Heading size="md" textAlign="left">
          Thông tin tài khoản
        </Heading>
      </Box>
      <Box style={styles.avt_box}>
        <Image
          source={require("@/assets/images/avatar-trang-4.jpg")}
          alt="Avatar"
          style={styles.image}
        />
      </Box>
      <Heading p={4} size={"md"}>
        {data.fullname}
      </Heading>

      <VStack w={'100%'} space={4}>
        <Box width="100%">
          <Text p={1} pl={2} fontWeight="bold">
            Số điện thoại:
          </Text>
          <Input
            fontSize="14px"
            px={5}
            style={styles.input_background}
            ref={inputRef}
            defaultValue={data.phone}
            placeholder="Nhập tên của bạn"
            variant="rounded"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
            ref={inputRef}
            defaultValue={data.email}
            placeholder="Nhập email của bạn"
            variant="rounded"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
            ref={inputRef}
            defaultValue={data.address}
            placeholder="Nhập tên của bạn"
            variant="rounded"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Box>
        <Button onPress={() => console.log("hello world")}>Cập nhật thông tin</Button>
        <Button onPress={() => console.log("hello world")}>Đổi mật khẩu</Button>
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
