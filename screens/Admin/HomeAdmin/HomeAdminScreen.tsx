import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Box, VStack, HStack, Text, Button, Heading } from "native-base";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const HomeAdminScreen: React.FC = () => {
  const [stats, setStats] = useState({
    users: { employees: 0, customers: 0, trainers: 0 },
    orders: { confirmed: 0, unconfirmed: 0, today: 0 },
    revenue: { total: 0 },
    subscriptions: { today: 0, previous: 0 },
  });
  const router = useRouter();

  const loadStats = async () => {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");

    try {
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/admin/dashboard`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );

      const data = response.data;
      const todayDate = new Date().toISOString().split("T")[0];

      // Parse data
      setStats({
        users: {
          employees: data.user_data.find((u) => u.VaiTro === "Employee")?.SoLuong || 0,
          trainers: data.user_data.find((u) => u.VaiTro === "HLV")?.SoLuong || 0,
          customers: data.user_data.find((u) => u.VaiTro === "KhachHang")?.SoLuong || 0,
        },
        orders: {
          confirmed: data.order_data
            .filter((o) => o.TrangThai === "Đã xác nhận")
            .reduce((sum, o) => sum + o.SoLuongDonHang, 0),
          unconfirmed: data.order_data
            .filter((o) => o.TrangThai === "Chưa xác nhận")
            .reduce((sum, o) => sum + o.SoLuongDonHang, 0),
          today: data.order_data
            .filter((o) => o.NgayDat === todayDate)
            .reduce((sum, o) => sum + o.SoLuongDonHang, 0),
        },
        revenue: {
          total: data.order_data.reduce((sum, o) => sum + parseFloat(o.DoanhThu), 0),
        },
        subscriptions: {
          today: data.gympack_data.filter((g) => g.NgayDangKy === todayDate).length,
          previous: data.gympack_data.length,
        },
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <VStack space={6}>
        <Heading textAlign="center" color="#2c3e50" fontWeight="bold">
          Thống kê quản trị
        </Heading>

        {/* Thống kê người dùng */}
        <Box style={styles.card}>
          <Heading size="md" color="#16a085">Người dùng</Heading>
          <HStack justifyContent="space-between" mt={3}>
            <Text>Nhân viên: {stats.users.employees}</Text>
            <Text>Khách hàng: {stats.users.customers}</Text>
            <Text>PT: {stats.users.trainers}</Text>
          </HStack>
        </Box>

        {/* Thống kê đơn hàng */}
        <Box style={styles.card}>
          <Heading size="md" color="#e67e22">Đơn hàng</Heading>
          <VStack space={2} mt={3}>
            <Text>Đã xác nhận: {stats.orders.confirmed}</Text>
            <Text>Chưa xác nhận: {stats.orders.unconfirmed}</Text>
            <Text>Phát sinh hôm nay: {stats.orders.today}</Text>
          </VStack>
        </Box>

        {/* Thống kê doanh thu */}
        <Box style={styles.card}>
          <Heading size="md" color="#2980b9">Doanh thu</Heading>
          <Text mt={3}>
            Tổng doanh thu: {stats.revenue.total.toLocaleString()} VNĐ
          </Text>
        </Box>

        {/* Thống kê lượt đăng ký gói tập */}
        <Box style={styles.card}>
          <Heading size="md" color="#c0392b">Lượt đăng ký gói tập</Heading>
          <VStack space={2} mt={3}>
            <Text>Hôm nay: {stats.subscriptions.today}</Text>
            <Text>Các ngày trước: {stats.subscriptions.previous}</Text>
          </VStack>
        </Box>

        {/* Các chức năng quản lý */}
        <Box>
          <Heading size="md" mb={4} color="#8e44ad">
            Chức năng quản lý
          </Heading>
          <VStack space={3}>
            <Button
              colorScheme="teal"
              onPress={() => router.push("/Manager/Admin/Users/Users")}
            >
              Quản lý người dùng
            </Button>
            <Button
              colorScheme="orange"
              onPress={() => router.push("/manage-trainers")}
            >
              Quản lý PT
            </Button>
            <Button
              colorScheme="blue"
              onPress={() => router.push("/manage-employees")}
            >
              Quản lý nhân viên
            </Button>
          </VStack>
        </Box>
      </VStack>
      <Box pb={100}></Box>
    </ScrollView>
  );
};

export default HomeAdminScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f9ff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
});
