import {
  Box,
  HStack,
  Image,
  Text,
  Actionsheet,
  useDisclose,
  Modal,
  Button,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MaterialIconsIcon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { userLogout } from "@/redux/actions/authActions";

export default function AdminAppBar() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclose();
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
    onClose();
    router.push("/"); // Quay lại trang chủ
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <HStack space={2} justifyContent={"space-between"} px={5}>
        {/* Logo */}
        <Box>
          <Image
            source={require("@/assets/images/logo.png")}
            alt="Logo"
            style={styles.logo}
          />
        </Box>

        {/* HStack cho các icon và menu */}
        <Box>
          <HStack
            space={5}
            alignItems="center"
            h={"100%"}
            justifyContent="center"
          >
            {/* Icon Trang chủ */}
            <Pressable onPress={() => router.push(`/Manager/Employee`)}>
              <VStack alignItems="center">
                <FontAwesomeIcon name="home" style={styles.icon} />
                <Text style={styles.iconText}>Trang chủ</Text>
              </VStack>
            </Pressable>

            {/* Icon QR Code */}
            <Pressable onPress={() => router.push(`/Manager/Employee/QRScan`)}>
              <VStack alignItems="center">
                <FontAwesomeIcon name="qrcode" style={styles.icon} />
                <Text style={styles.iconText}>Quét QR</Text>
              </VStack>
            </Pressable>

            {/* Icon Menu */}
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
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  icon: {
    fontSize: 30,
  },
  menuIcon: {
    fontSize: 24,
    color: "#000",
    marginRight: 10,
  },
  menuText: {
    fontSize: 18,
  },
  closeText: {
    fontSize: 18,
    color: "red",
  },
  iconText: {
    fontSize: 14,
    color: "#000",
    marginTop: 5,
  },
});
