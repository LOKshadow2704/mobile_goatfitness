import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Heading,
  HStack,
  ScrollView,
  Text,
  View,
  VStack,
  Spinner,
} from "native-base";
import { Pressable, StyleSheet, RefreshControl } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { DashboardData, processDataForCharts } from "./data";
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
  const router = useRouter();

  // Hàm lấy dữ liệu từ API
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

      const data: DashboardData = response.data;
      const processedData = processDataForCharts(data);
      setCustomerStackData(processedData.customerStackData);
      setOrderStackData(processedData.orderStackData);
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

  // Hàm refresh dữ liệu
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // Render label cho từng cột stack
  const renderStackLabel = (value: number) => (
    <Text
      style={{ fontSize: 10, color: "#000", position: "absolute", top: -15 }}
    >
      {value}
    </Text>
  );

  // Chỉ tính toán lại dữ liệu khi cần thiết (tối ưu hóa rerender)
  const customerStackDataMemo = useMemo(
    () => customerStackData,
    [customerStackData]
  );
  const orderStackDataMemo = useMemo(() => orderStackData, [orderStackData]);

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
        <VStack space={2}>
          <Box p={4} bg="white" borderRadius={12} shadow={3} mt={4} mb={5}>
            <VStack space={20} pb={5}>
              {/* Biểu đồ khách hàng */}
              <Box width="100%" height={180}>
                <Heading size="xs" mb={2}>
                  Khách Hàng Tập Hằng Ngày
                </Heading>
                <BarChart
                  width={300}
                  rotateLabel={false}
                  noOfSections={5}
                  stackData={customerStackDataMemo}
                  isAnimated
                  animationDuration={1500}
                  height={120}
                  renderStackLabel={renderStackLabel}
                />
                <HStack space={4} mt={2} justifyContent="center">
                  <HStack alignItems="center" space={1}>
                    <Box width={3} height={3} bg="#FF6384" borderRadius={2} />
                    <Text fontSize={12}>Khách đã check-out</Text>
                  </HStack>
                  <HStack alignItems="center" space={1}>
                    <Box width={3} height={3} bg="#4ABFF4" borderRadius={2} />
                    <Text fontSize={12}>Khách chưa check-out</Text>
                  </HStack>
                </HStack>
              </Box>

              <HStack space={4} justifyContent="space-between">
                {/* Biểu đồ tổng đơn hàng */}
                <Box width="100%" height={180}>
                  <Heading size="xs" mb={2}>
                    Tổng Đơn Hàng Hôm Nay
                  </Heading>
                  <BarChart
                    width={320}
                    rotateLabel={false}
                    noOfSections={5}
                    stackData={orderStackDataMemo}
                    isAnimated
                    animationDuration={1500}
                    height={120}
                    renderStackLabel={renderStackLabel}
                  />
                  <HStack space={4} mt={2} justifyContent="center">
                    <HStack alignItems="center" space={1}>
                      <Box width={3} height={3} bg="#FF6384" borderRadius={2} />
                      <Text fontSize={12}>Đơn hàng đã xử lý</Text>
                    </HStack>
                    <HStack alignItems="center" space={1}>
                      <Box width={3} height={3} bg="#36A2EB" borderRadius={2} />
                      <Text fontSize={12}>Đơn hàng mới</Text>
                    </HStack>
                  </HStack>
                </Box>
              </HStack>
            </VStack>
          </Box>

          {/* Các chức năng quản lý */}
          <Box p={4} bg="white" borderRadius={12} shadow={3} mt={4}>
            <Heading size="sm" mb={3}>
              Các chức năng quản lý
            </Heading>
            <VStack space={3}>
              <HStack space={3} justifyContent="space-between">
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    router.push(`/Manager/Employee/PackageGym/PackageGym`)
                  }
                >
                  <Text style={styles.buttonText}>Quản lý Gói tập</Text>
                </Pressable>
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    router.push(`/Manager/Employee/Product/Product`)
                  }
                >
                  <Text style={styles.buttonText}>Quản lý Sản phẩm</Text>
                </Pressable>
              </HStack>
              <HStack space={3} justifyContent="space-between">
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
                  onPress={() =>
                    router.push(`/Manager/Employee/Categories/Categories`)
                  }
                >
                  <Text style={styles.buttonText}>Danh mục sản phẩm</Text>
                </Pressable>
              </HStack>
            </VStack>
          </Box>
        </VStack>
        <Box pb={100}></Box>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
    padding: 12,
    backgroundColor: "#081158",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeAdmin;
