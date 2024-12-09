import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import {
  fetchPersonalTrainers,
  acceptPersonalTrainer,
  rejectPersonalTrainer,
  fetchAllPersonalTrainers,
} from "./api";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "native-base";

interface PersonalTrainer {
  IDHLV: number;
  HoTen: string;
  DiaChi: string;
  Email: string;
  SDT: string;
  avt: string;
  DichVu: string;
  GiaThue: number;
  IDKhachHang: number;
  ChungChi: string;
}

export default function PersonalTrainerScreen() {
  const [trainers, setTrainers] = useState<PersonalTrainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadData = async () => {
    setLoading(true);
    try {
      const trainerResponse = await fetchPersonalTrainers();
      if (trainerResponse.status === 200) {
        setTrainers(trainerResponse.data);
        setError(null);
      } else {
        setError("Không có huấn luyện viên nào đang chờ xác thực.");
      }
    } catch (err: any) {
      console.log("Error fetching trainers:", err.response?.data || err);
      setError("Không có huấn luyện viên nào đang chờ xác thực.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAccept = async (id: number) => {
    try {
      const response = await acceptPersonalTrainer(id);
      Alert.alert("Thành công", response.success);
      setTrainers(trainers.filter((trainer) => trainer.IDHLV !== id));
      if (trainers.length === 1) {
        setError("Không còn huấn luyện viên nào đang chờ xác thực.");
      }
    } catch (error) {
      console.error("Error accepting trainer:", error);
      Alert.alert("Lỗi", "Không thể xác nhận PT.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await rejectPersonalTrainer(id);
      Alert.alert("Thành công", response.success);
      setTrainers(trainers.filter((trainer) => trainer.IDHLV !== id));
      if (trainers.length === 1) {
        setError("Không còn huấn luyện viên nào đang chờ xác thực.");
      }
    } catch (error) {
      console.error("Error rejecting trainer:", error);
      Alert.alert("Lỗi", "Không thể từ chối PT.");
    }
  };

  const renderTrainer = (trainer: PersonalTrainer) => (
    <View style={styles.card} key={trainer.IDHLV}>
      <View>
        <View style={styles.infoRow} alignItems={"center"}>
          <Image source={{ uri: trainer.avt }} style={styles.avatar} />
          <Text style={styles.name}>{trainer.HoTen}</Text>
        </View>
        <View style={styles.info} pl={3}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Địa chỉ: </Text>
            <Text style={styles.value}>{trainer.DiaChi}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email: </Text>
            <Text style={styles.value}>{trainer.Email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>SDT: </Text>
            <Text style={styles.value}>{trainer.SDT}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dịch vụ: </Text>
            <Text style={styles.value}>{trainer.DichVu}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá thuê: </Text>
            <Text style={styles.value}>
              {trainer.GiaThue.toLocaleString()} VNĐ
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(trainer.IDHLV)}
        >
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleReject(trainer.IDHLV)}
        >
          <Text style={styles.buttonText}>Từ chối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="exit-to-app" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Quản lý PT</Text>
      </View>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {trainers.map(renderTrainer)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f9ff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 50,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#dc3545",
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  info: {
    flex: 1,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    width: "25%",
  },
  value: {
    fontSize: 14,
    color: "#555",
    width: "75%",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
