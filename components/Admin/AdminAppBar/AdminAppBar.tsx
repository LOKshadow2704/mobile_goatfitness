import { Box, HStack, Image, Text, Modal, Button, VStack } from "native-base";
import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { userLogout } from "@/redux/actions/authActions";

export default function AdminAppBar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
    router.push("/"); // Quay lại trang chủ
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <HStack
        space={2}
        justifyContent="space-between"
        px={5}
        alignItems="center"
      >
        {/* Logo */}
        <Box>
          <Image
            source={require("@/assets/images/logo.png")}
            alt="Logo"
            style={styles.logo}
          />
        </Box>

        {/* Các nút chức năng */}
        <Box>
          <HStack space={10} alignItems="center">
            {/* Trang chủ */}
            <Pressable onPress={() => router.push(`/Manager/Admin`)}>
              <VStack alignItems="center">
                <FontAwesomeIcon name="home" style={styles.icon} />
                <Text style={styles.iconText}>Trang chủ</Text>
              </VStack>
            </Pressable>

            {/* Thông tin tài khoản */}
            <Pressable
              onPress={() => router.push(`/Manager/Admin/AccountInfo`)}
            >
              <VStack alignItems="center">
                <FontAwesomeIcon name="user" style={styles.icon} />
                <Text style={styles.iconText}>Tài khoản</Text>
              </VStack>
            </Pressable>
          </HStack>
        </Box>
      </HStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: "#e0f2fe",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 5,
    height:80
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  icon: {
    fontSize: 30,
    color: "#000",
  },
  iconText: {
    fontSize: 14,
    color: "#000",
    marginTop: 5,
  },
});
