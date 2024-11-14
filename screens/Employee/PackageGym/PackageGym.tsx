import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
import { processDataForChart } from "./data";
import { LinearGradient } from "expo-linear-gradient";
import ConfirmPaymentModal from "@/components/Admin/ConfirmPaymentModal/ConfirmPaymentModal";
import RegisterPackageModal from "@/components/Admin/RegisterPackageModal/RegisterPackageModal";
import { Button } from "native-base";
import { useRouter } from "expo-router";

interface User {
  TenDangNhap: string;
  HoTen: string;
  DiaChi: string;
  Email: string;
  SDT: string;
  avt: string;
  IDHoaDon: number | null;
  NgayDangKy: string | null;
  NgayHetHan: string | null;
  TrangThaiThanhToan: string | null;
}

const PackageGymScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [showRegisterPackageModal, setShowRegisterPackageModal] =
    useState(false);
  const [selectedSDT, setSelectedSDT] = useState<string | null>(null);
  const [selectedIDHoaDon, setSelectedIDHoaDon] = useState<number | null>(null);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      if (!accessToken || !phpSessId) {
        console.error("Thiếu mã truy cập hoặc PHP session ID.");
        return;
      }

      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/employee/user/gympack`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );
      setUsers(response.data);
      setFilteredUsers(response.data);
      const data_chart: any = processDataForChart(response.data);
      setChartData(data_chart);
    } catch (error: any) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleConfirmPayment = () => {
    setShowConfirmPaymentModal(false);
  };

  const handleRegisterPackage = () => {
    setShowRegisterPackageModal(false);
  };

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.SDT.includes(searchQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  useEffect(() => {
    fetchUsers();
  }, [showRegisterPackageModal, showConfirmPaymentModal]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, marginBottom: 100 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="exit-to-app" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Quản lý Gói Tập Gym</Text>
      </View>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          radius={70}
          isAnimated
          animationDuration={1000}
          showText
          textColor="black"
          showValuesAsLabels
          textSize={10}
          fontWeight="bold"
          strokeWidth={1}
          focusOnPress
        />
        <View style={styles.chartLegend}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <TextInput
        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      <Button
        onPress={() => router.push(`/Manager/Employee/PackageGym/UpdatePrice`)}
        mb={2}
      >
        Cập nhật giá gói tập
      </Button>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.TenDangNhap}
        renderItem={({ item }) => {
          let colors = ["#FFCCCC", "#FF7777"];
          if (
            item.IDHoaDon !== null &&
            item.TrangThaiThanhToan === "Đã Thanh Toán"
          ) {
            colors = ["#36A2EB", "#1E88E5"];
          } else if (
            item.IDHoaDon !== null &&
            item.TrangThaiThanhToan !== "Đã Thanh Toán"
          ) {
            colors = ["#A5D6A7", "#66BB6A"];
          }

          return (
            <TouchableOpacity
              onPress={() => {
                if (item.IDHoaDon === null) {
                  setSelectedSDT(item.SDT);
                  setSelectedIDHoaDon(item.IDHoaDon);
                  setShowRegisterPackageModal(true);
                } else if (item.TrangThaiThanhToan === "Chưa Thanh Toán") {
                  setSelectedSDT(item.SDT);
                  setSelectedIDHoaDon(item.IDHoaDon);
                  setShowConfirmPaymentModal(true);
                }
              }}
            >
              <LinearGradient colors={colors} style={styles.userItem}>
                <Image source={{ uri: item.avt }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {item.HoTen} - {item.SDT}
                  </Text>
                  <Text style={{ fontSize: 14 }}>{item.DiaChi}</Text>
                  <Text style={{ fontSize: 14 }}>{item.Email}</Text>
                  <Text
                    style={{ fontSize: 14, fontWeight: "bold", color: "black" }}
                  >
                    {item.IDHoaDon !== null
                      ? item.TrangThaiThanhToan === "Đã Thanh Toán"
                        ? "Đã có gói tập"
                        : "Chưa thanh toán"
                      : "Chưa có gói tập"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <ConfirmPaymentModal
        visible={showConfirmPaymentModal}
        onClose={() => setShowConfirmPaymentModal(false)}
        onConfirm={handleConfirmPayment}
        IDHoaDon={selectedIDHoaDon}
      />
      <RegisterPackageModal
        visible={showRegisterPackageModal}
        onClose={() => setShowRegisterPackageModal(false)}
        onRegister={handleRegisterPackage}
        SDT={selectedSDT}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  chartLegend: {
    flexDirection: "row",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  legendColor: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 12,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default PackageGymScreen;
