import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Heading,
  HStack,
  ScrollView,
  Text,
  View,
  VStack,
  Spinner,
  Badge,
} from "native-base";
import { Pressable, StyleSheet, RefreshControl } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

const HomeAdmin: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [customerStackData, setCustomerStackData] = useState<any[]>([]);
  const [orderStackData, setOrderStackData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUnprocessedOrders, setTotalUnprocessedOrders] = useState(0);

  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);

      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      if (!accessToken || !phpSessId) {
        console.error("Không tìm thấy thông tin xác thực.");
        return;
      }

      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/employee/dashboard`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );

      const data = response.data;

      // Xử lý dữ liệu khách hàng check-in
      const checkinData = data.checkin || [];
      const customerCountByDate = checkinData.reduce((acc: any, entry: any) => {
        const date = entry.ThoiGian.split(" ")[0]; // Chỉ lấy phần ngày
        if (!acc[date]) acc[date] = { checkIn: 0, checkOut: 0 };

        // Tính số lần check-in và check-out
        if (entry.CheckOut === 1) acc[date].checkOut += 1; // Nếu có check-out
        else acc[date].checkIn += 1; // Nếu không có check-out (check-in)
        return acc;
      }, {});

      // Chuyển đổi thành mảng và sắp xếp theo ngày
      const sortedCustomerData = Object.keys(customerCountByDate)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((date) => ({
          date,
          totalCheckIn: customerCountByDate[date].checkIn,
          totalCheckOut: customerCountByDate[date].checkOut,
          totalCheckInCheckOut:
            customerCountByDate[date].checkIn +
            customerCountByDate[date].checkOut, // Tổng check-in và check-out
        }));
      setCustomerStackData(sortedCustomerData);

      // Xử lý doanh thu và đơn hàng
      const ordersData = data.orders || [];
      const totalRevenue = ordersData.reduce(
        (total: number, order: any) => total + order.ThanhTien,
        0
      );
      setTotalRevenue(totalRevenue);

      const orderCountByDate = ordersData.reduce((acc: any, order: any) => {
        const date = order.NgayDat.split(" ")[0]; // Chỉ lấy phần ngày
        if (!acc[date]) acc[date] = { processed: 0, unprocessed: 0 };
        if (order.TrangThai === "Chưa xác nhận") acc[date].unprocessed += 1;
        else acc[date].processed += 1;
        return acc;
      }, {});

      const sortedOrderData = Object.keys(orderCountByDate)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((date) => ({
          date,
          ...orderCountByDate[date],
        }));
      setOrderStackData(sortedOrderData);

      const totalUnprocessed = sortedOrderData.reduce(
        (total: number, data) => total + data.unprocessed,
        0
      );
      setTotalUnprocessedOrders(totalUnprocessed);
    } catch (error: any) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <Spinner color="blue.500" size="lg" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <VStack space={4}>
          {/* Header */}
          <Box p={4} bg="#e3f2fd" borderRadius={12} shadow={3} mt={4}>
            <Heading size="lg" color="#0d47a1">
              Dashboard
            </Heading>
            <VStack space={4} mt={3}>
              <HStack justifyContent="space-between">
                <Text fontWeight="bold" color="#1e88e5">
                  Tổng khách đã check-in:
                </Text>
                <Badge colorScheme="blue" borderRadius={8}>
                  {customerStackData.reduce(
                    (acc, data) => acc + (data.totalCheckInCheckOut || 0),
                    0
                  )}
                </Badge>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontWeight="bold" color="#1e88e5">
                  Tổng doanh thu:
                </Text>
                <Text color="#2e7d32" fontWeight="bold">
                  {totalRevenue.toLocaleString()} VND
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Dữ liệu khách hàng check-in */}
          <Box p={4} bg="white" borderRadius={12} shadow={3}>
            <Heading size="sm" mb={3} color="#0d47a1">
              Khách hàng check-in theo ngày
            </Heading>
            <VStack space={3}>
              {customerStackData.length === 0 ? (
                <Text>Không có dữ liệu khách hàng check-in.</Text>
              ) : (
                customerStackData.map((data, index) => (
                  <Box
                    key={index}
                    p={3}
                    bg="#f0f9ff"
                    borderRadius={8}
                    shadow={2}
                  >
                    <HStack justifyContent="space-between">
                      <Text color="#1565c0">{data.date}</Text>
                      <Text>
                        Check-in: {data.totalCheckIn}, Check-out:{" "}
                        {data.totalCheckOut}
                      </Text>
                    </HStack>
                  </Box>
                ))
              )}
            </VStack>
          </Box>

          {/* Dữ liệu đơn hàng */}
          <Box p={4} bg="white" borderRadius={12} shadow={3}>
            <Heading size="sm" mb={3} color="#0d47a1">
              Đơn hàng theo ngày
            </Heading>
            <VStack space={3}>
              {orderStackData.length === 0 ? (
                <Text>Không có dữ liệu đơn hàng.</Text>
              ) : (
                orderStackData.map((data, index) => (
                  <Box
                    key={index}
                    p={3}
                    bg="#f0f9ff"
                    borderRadius={8}
                    shadow={2}
                  >
                    <HStack justifyContent="space-between">
                      <Text color="#1565c0">{data.date}</Text>
                      <VStack>
                        <Text>Đơn hàng chưa xác nhận: {data.unprocessed}</Text>
                        <Text>Đơn hàng đã xác nhận: {data.processed}</Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))
              )}
              <Box p={3} bg="#e3f2fd" borderRadius={8} mt={4}>
                <HStack justifyContent="space-between">
                  <Text fontWeight="bold">Tổng đơn hàng chưa xử lý:</Text>
                  <Text fontWeight="bold" color="#e53935">
                    {totalUnprocessedOrders}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>

          {/* Chức năng quản lý */}
          <Box p={4} bg="white" borderRadius={12} shadow={3}>
            <Heading size="sm" mb={3} color="#0d47a1">
              Các chức năng quản lý
            </Heading>
            <VStack space={3}>
              <Pressable
                style={styles.button}
                onPress={() =>
                  router.push("/Manager/Employee/PackageGym/PackageGym")
                }
              >
                <Text style={styles.buttonText}>Quản lý Gói tập</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => router.push("/Manager/Employee/Product/Product")}
              >
                <Text style={styles.buttonText}>Quản lý Sản phẩm</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() =>
                  router.push(`/Manager/Employee/PurchaseOrder/PurchaseOrder`)
                }
              >
                <Text style={styles.buttonText}>Quản lý Đơn hàng</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => router.push("/Manager/Employee/Categories/Categories")}
              >
                <Text style={styles.buttonText}>Quản lý loại sản phẩm</Text>
              </Pressable>

              <Pressable
                style={styles.button}
                onPress={() => router.push("/Manager/Employee/WorkSchedule")}
              >
                <Text style={styles.buttonText}>Lịch làm việc</Text>
              </Pressable>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
      <Box pb={70}></Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
    padding: 10,
  },
  button: {
    backgroundColor: "#1565c0",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeAdmin;
