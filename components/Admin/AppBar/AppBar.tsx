import {
  Box,
  HStack,
  Image,
  Text,
  Actionsheet,
  useDisclose,
  Modal,
  Button,
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
            space={50}
            alignItems="center"
            h={"100%"}
            justifyContent="center"
          >
            {/* Icon Trang chủ */}
            <Pressable onPress={() => router.push(`/Manager/Employee`)}>
              <FontAwesomeIcon name="home" style={styles.icon} />
            </Pressable>

            {/* Icon QR Code */}
            <Pressable onPress={() => router.push(`/Manager/Employee/QRScan`)}>
              <FontAwesomeIcon name="qrcode" style={styles.icon} />
            </Pressable>

            {/* Icon Menu */}
            <Pressable onPress={onOpen}>
              <FontAwesomeIcon name="list-ul" style={styles.icon} />
            </Pressable>
          </HStack>
        </Box>
      </HStack>

      {/* Menu Actionsheet */}
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item  onPress={() => router.push(`/Manager/Employee/AccountInfo`)}>
            <HStack>
              <FontAwesomeIcon name="user" style={styles.menuIcon} />
              <Text style={styles.menuText}>Thông tin cá nhân</Text>
            </HStack>
          </Actionsheet.Item>
          <Actionsheet.Item onPress={handleLogout}>
            <HStack>
              <MaterialIconsIcon name="logout" style={styles.menuIcon} />
              <Text style={styles.menuText}>Đăng xuất</Text>
            </HStack>
          </Actionsheet.Item>
          <Actionsheet.Item onPress={onClose} color="red.500">
            <Text style={styles.closeText}>Đóng</Text>
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      {/* Modal xác nhận đăng xuất */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
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
});
