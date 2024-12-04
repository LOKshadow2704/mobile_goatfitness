import React, { useState, useCallback, useEffect } from "react";
import { Box, Heading, HStack, ScrollView, Text, View, VStack, Spinner } from "native-base";
import { Pressable, StyleSheet, RefreshControl } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

interface HomeAdminProps {}

const HomeAdmin: React.FC<HomeAdminProps> = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [customerStackData, setCustomerStackData] = useState<any[]>([]);
  const [orderStackData, setOrderStackData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalUnprocessedOrders, setTotalUnprocessedOrders] = useState<number>(0); // Biến lưu tổng số đơn hàng chưa xử lý
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

      // Lọc và sắp xếp khách hàng check-in theo ngày
      const customerCountByDate = data.checkin.reduce((acc: any, entry: any) => {
        const date = entry.ThoiGian;
        if (!acc[date]) acc[date] = { checkIn: 0, checkOut: 0 };
        if (entry.CheckOut === 1) acc[date].checkOut += 1;
        else acc[date].checkIn += 1;
        return acc;
      }, {});

      // Sắp xếp theo ngày
      const sortedCustomerData = Object.keys(customerCountByDate)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((date) => ({
          date,
          ...customerCountByDate[date],
        }));
      setCustomerStackData(sortedCustomerData);

      // Tính tổng doanh thu
      const totalRevenue = data.orders.reduce((total: number, order: any) => total + order.ThanhTien, 0);
      setTotalRevenue(totalRevenue);

      // Lọc và sắp xếp đơn hàng theo ngày
      const orderCountByDate = data.orders.reduce((acc: any, order: any) => {
        const date = order.NgayDat;
        if (!acc[date]) acc[date] = { processed: 0, unprocessed: 0 };
        if (order.TrangThai === "Chưa xác nhận") acc[date].unprocessed += 1;
        else acc[date].processed += 1;
        return acc;
      }, {});

      // Sắp xếp theo ngày
      const sortedOrderData = Object.keys(orderCountByDate)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((date) => ({
          date,
          ...orderCountByDate[date],
        }));
      setOrderStackData(sortedOrderData);

      // Tính tổng đơn hàng chưa xác nhận
      const totalUnprocessed = sortedOrderData.reduce((total: number, data) => total + data.unprocessed, 0);
      setTotalUnprocessedOrders(totalUnprocessed);

    } catch (error: any) {
      console.error("Error fetching data:", error.response?.data || error.message);
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <VStack space={2}>
          {/* Header */}
          <Box p={4} bg="white" borderRadius={12} shadow={3} mt={4} mb={5}>
            <Heading size="lg">Dashboard</Heading>
            <VStack space={4} justifyContent="space-between" mt={3}>
              <Text>Tổng khách đã check-in: {customerStackData.reduce((acc, data) => acc + data.checkIn, 0)}</Text>
              <Text>Tổng doanh thu: {totalRevenue.toLocaleString()} VND</Text>
            </VStack>
          </Box>

          {/* Hiển thị dữ liệu khách hàng check-in */}
          <Box p={4} bg="white" borderRadius={12} shadow={3}>
            <Heading size="xs" mb={2}>Khách hàng check-in theo ngày</Heading>
            <VStack space={2}>
              {customerStackData.map((data, index) => (
                <Box key={index} p={3} bg="#f0f9ff" borderRadius={8} shadow={2}>
                  <HStack space={4} justifyContent="space-between">
                    <Text>{data.date}</Text>
                    <Text>Check-in: {data.checkIn}</Text>
                    <Text>Check-out: {data.checkOut}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Hiển thị dữ liệu đơn hàng */}
          <Box p={4} bg="white" borderRadius={12} shadow={3} mt={5}>
            <Heading size="xs" mb={2}>Đơn hàng theo ngày</Heading>
            <VStack space={2}>
              {orderStackData.map((data, index) => (
                <Box key={index} p={3} bg="#f0f9ff" borderRadius={8} shadow={2}>
                  <HStack space={4} justifyContent="space-between">
                    <Text>{data.date}</Text>
                    <VStack>
                      <Text>Đơn hàng chưa xác nhận: {data.unprocessed}</Text>
                      <Text>Đơn hàng đã xác nhận: {data.processed}</Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
            {/* Hiển thị tổng đơn hàng chưa xử lý */}
            <Box p={3} bg="#e3f2fd" borderRadius={8} mt={4}>
              <HStack justifyContent="space-between">
                <Text fontWeight="bold">Tổng đơn hàng chưa xử lý:</Text>
                <Text>{totalUnprocessedOrders}</Text>
              </HStack>
            </Box>
          </Box>

          {/* Các chức năng quản lý */}
          <Box p={4} bg="white" borderRadius={12} shadow={3} mt={5}>
            <Heading size="sm" mb={3}>Các chức năng quản lý</Heading>
            <VStack space={3}>
              <HStack space={3} justifyContent="space-between">
                <Pressable style={styles.button} onPress={() => router.push("/Manager/Employee/PackageGym/PackageGym")}>
                  <Text style={styles.buttonText}>Quản lý Gói tập</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => router.push("/Manager/Employee/Product/Product")}>
                  <Text style={styles.buttonText}>Quản lý Sản phẩm</Text>
                </Pressable>
              </HStack>
              <HStack space={3} justifyContent="space-between">
                <Pressable style={styles.button} onPress={() => router.push("/Manager/Employee/PurchaseOrder/PurchaseOrder")}>
                  <Text style={styles.buttonText}>Quản lý Đơn hàng</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => router.push("/Manager/Employee/Categories/Categories")}>
                  <Text style={styles.buttonText}>Danh mục SP</Text>
                </Pressable>
              </HStack>
              <Pressable style={styles.button} onPress={() => router.push("/Manager/Employee/WorkSchedule")}>
                  <Text style={styles.buttonText}>Lịch làm việc</Text>
                </Pressable>
            </VStack>
          </Box>
        </VStack>
        <Box pb={70}></Box>
      </ScrollView>
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
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    height: 40
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeAdmin;
