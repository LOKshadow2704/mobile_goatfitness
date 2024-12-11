import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout";
import {
  Text,
  VStack,
  Box,
  Image,
  View,
  ScrollView,
  IconButton,
  Icon,
} from "native-base";
import Constants from "expo-constants";
import { useRouter } from "expo-router"; // Import useRouter để điều hướng với expo-router
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

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
  orderInfo: OrderInfo[] | false;
}

const PurchaseOrderScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        const phpSessId = await SecureStore.getItemAsync("phpsessid");

        const response = await axios.get<{ orders: Order[] }>(
          `${Constants.expoConfig?.extra?.API_URL}/order/purchase`,
          {
            headers: {
              PHPSESSID: phpSessId || "",
              Authorization: `Bearer ${accessToken}`,
              "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
            },
          }
        );
        console.log(response.data)
        // Kiểm tra xem response.data.orders có phải là một mảng không
        if (Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Đã thanh toán":
        return "emerald.600";
      case "Chưa thanh toán":
        return "red.600";
      case "Đang xử lý":
        return "orange.500";
      default:
        return "coolGray.600";
    }
  };

  return (
    <DefaultLayout>
      <View flexDirection="row" alignItems="center" my={5} w={'100%'}>
        <IconButton
          icon={
            <Icon
              as={MaterialIcons}
              name="arrow-back"
              size="lg"
              color="coolGray.700"
            />
          }
          onPress={() => router.back()} 
          mr={2}
        />
        <Text fontSize="xl" bold textAlign="left">
          Danh Sách Đơn Hàng
        </Text>
      </View>
      <ScrollView>
        <View px={4}>
          <VStack space={4}>
            {orders.length > 0 ? (
              orders.map((item) => (
                <Box
                  width="100%"
                  borderWidth={1}
                  borderColor="coolGray.300"
                  borderRadius="md"
                  p={4}
                  mb={4}
                  bg="coolGray.50"
                  key={item.IDDonHang}
                >
                  <Text bold color="coolGray.700">
                    🆔 ID Đơn Hàng: {item.IDDonHang}
                  </Text>
                  <Text color="coolGray.600">📅 Ngày Đặt: {item.NgayDat}</Text>
                  <Text color="coolGray.600">
                    📦 Ngày Giao Dự Kiến: {item.NgayGiaoDuKien}
                  </Text>
                  <Text color={getPaymentStatusColor(item.TrangThaiThanhToan)}>
                    💳 Trạng Thái Thanh Toán: {item.TrangThaiThanhToan}
                  </Text>
                  <Text color="coolGray.600">📍 Địa Chỉ: {item.DiaChi}</Text>
                  <Text bold fontSize="md" color="emerald.600">
                    💰 Tổng Tiền: {item.ThanhTien} VND
                  </Text>

                  {item.orderInfo ? (
                    <VStack mt={3} space={2}>
                      {item.orderInfo.map((product, index) => (
                        <Box
                          key={index}
                          flexDirection="row"
                          alignItems="center"
                          bg="white"
                          borderRadius="md"
                          p={2}
                          mb={2}
                          shadow={1}
                          width="100%"
                        >
                          <Image
                            source={{ uri: product.IMG }}
                            alt={product.TenSP}
                            size="sm"
                            mr={3}
                            borderRadius="md"
                          />
                          <VStack flex={1}>
                            <Text bold color="coolGray.800">
                              {product.TenSP}
                            </Text>
                            <Text color="coolGray.600">
                              🔢 Số Lượng: {product.SoLuong}
                            </Text>
                            <Text color="coolGray.600">
                              💸 Đơn Giá: {product.DonGia} VND
                            </Text>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text mt={2} italic color="coolGray.500">
                      Không có sản phẩm nào trong đơn hàng này.
                    </Text>
                  )}
                </Box>
              ))
            ) : (
              <Text italic color="coolGray.500" textAlign="center">
                Không có đơn hàng nào để hiển thị.
              </Text>
            )}
          </VStack>
        </View>
      </ScrollView>
    </DefaultLayout>
  );
};

export default PurchaseOrderScreen;
