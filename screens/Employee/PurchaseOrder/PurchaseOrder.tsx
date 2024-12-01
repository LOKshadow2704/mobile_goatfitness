import React, { useEffect, useState } from "react";
import {
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Spinner,
  Heading,
  Divider,
  Center,
  Button,
} from "native-base";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface OrderInfo {
  TenSP: string;
  IDSanPham: number;
  SoLuong: number;
  DonGia: number;
  IMG: string;
}

interface Order {
  IDDonHang: number;
  IDKhachHang: number;
  IDHinhThuc: number;
  NgayDat: string;
  NgayGiaoDuKien: string;
  TrangThaiThanhToan: string;
  DiaChi: string;
  ThanhTien: number;
  orderInfo: OrderInfo[];
}

const PurchaseOrderScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();

  // Hàm lấy đơn hàng
  const fetchOrders = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      if (!accessToken || !phpSessId) {
        console.error("Không lấy được dữ liệu xác thực.");
        return;
      }

      const response = await axios.get<{ orders: Order[] }>(
        `${Constants.expoConfig?.extra?.API_URL}/employee/order/unconfirm/get`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );

      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleOrderAction = (orderId: number) => {
    Alert.alert(
      "Xác nhận hoàn thành chuẩn bị",
      `Bạn đã hoàn thành chuẩn bị đơn hàng có ID ${orderId}?`,
      [
        {
          text: "Close",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => handleConfirmOrder(orderId),
        },
      ]
    );
  };

  // Hàm xác nhận đơn hàng
  const handleConfirmOrder = async (orderId: number) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      if (!accessToken || !phpSessId) {
        console.error("Không lấy được dữ liệu xác thực.");
        return;
      }
      const response = await axios.put(
        `${Constants.expoConfig?.extra?.API_URL}/employee/order/confirm`,
        { IDDonHang: orderId },
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );
      if (response.status == 200) {
        Alert.alert("Thành công", "Cập nhật thành công");
        return;
      }
    } catch (error) {
      Alert.alert("Error", "Failed to confirm order.");
      console.error(error);
    }
  };

  // Fetch dữ liệu khi màn hình được load lần đầu
  useEffect(() => {
    fetchOrders();
  }, []);

  // Nếu đang tải dữ liệu
  if (loading) {
    return (
      <Center flex={1}>
        <Spinner size="lg" />
        <Text mt={4}>Loading orders...</Text>
      </Center>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <HStack my={5}  alignItems={'center'}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="exit-to-app" size={20} color="white" />
        </TouchableOpacity>
        <Heading textAlign="center" size="lg" ml={4}>
          Quản lý đơn hàng
        </Heading>
      </HStack>

      {orders.map((order) => (
        <Box
          key={order.IDDonHang}
          borderWidth={1}
          borderColor="coolGray.200"
          borderRadius="md"
          shadow={2}
          bg="white"
          p={4}
          mb={4}
          onTouchEnd={() => handleOrderAction(order.IDDonHang)} // Khi nhấn vào đơn hàng
        >
          <VStack space={3}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="md" bold>
                Order ID: {order.IDDonHang}
              </Text>
              <Text color="coolGray.500" italic>
                {order.NgayDat}
              </Text>
            </HStack>
            <Text fontSize="sm" color="coolGray.700">
              Ngày đặt: {order.NgayGiaoDuKien}
            </Text>
            <Text fontSize="sm" color="coolGray.700">
              Địa chỉ: {order.DiaChi}
            </Text>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="sm" bold color="primary.500">
                Thành tiền: {order.ThanhTien.toLocaleString()} VND
              </Text>
              <Text
                fontSize="sm"
                bold
                color={
                  order.TrangThaiThanhToan === "Đã thanh toán"
                    ? "green.600"
                    : "red.600"
                }
              >
                {order.TrangThaiThanhToan}
              </Text>
            </HStack>
            <Divider my={2} />
            {order.orderInfo.map((item) => (
              <HStack key={item.IDSanPham} space={3} alignItems="center">
                <Image
                  source={{ uri: item.IMG }}
                  alt={item.TenSP}
                  size="md"
                  borderRadius="sm"
                />
                <VStack space={1}>
                  <Text fontSize="sm" bold w={"90%"}>
                    {item.TenSP.length > 30
                      ? `${item.TenSP.slice(0, 30)}...`
                      : item.TenSP}
                  </Text>
                  <Text fontSize="xs" color="coolGray.600">
                    Quantity: {item.SoLuong}
                  </Text>
                  <Text fontSize="xs" color="coolGray.600">
                    Price: {item.DonGia.toLocaleString()} VND
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      ))}
      <Box pb={70}></Box>
    </ScrollView>
  );
};

export default PurchaseOrderScreen;

const styles = StyleSheet.create({
  backButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
