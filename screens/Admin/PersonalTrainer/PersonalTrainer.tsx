import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  fetchPersonalTrainers,
  acceptPersonalTrainer,
  rejectPersonalTrainer,
  fetchAllPersonalTrainers,
} from "./api";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
  const [verifiedTrainers, setVerifiedTrainers] = useState<PersonalTrainer[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const trainerResponse = await fetchPersonalTrainers();
        if (trainerResponse.status === 200) {
          setTrainers(trainerResponse.data);
          setError(null);
        }

        const verifiedResponse = await fetchAllPersonalTrainers();
        setVerifiedTrainers(verifiedResponse);
      } catch (err: any) {
        console.log("Error fetching trainers:", err.response?.data || err);
        setError("Không có huấn luyện viên nào đang chờ xác thực.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const renderTrainer = ({ item }: { item: PersonalTrainer }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avt }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.HoTen}</Text>
        <Text style={styles.detail}>Địa chỉ: {item.DiaChi}</Text>
        <Text style={styles.detail}>Email: {item.Email}</Text>
        <Text style={styles.detail}>SDT: {item.SDT}</Text>
        <Text style={styles.detail}>Dịch vụ: {item.DichVu}</Text>
        <Text style={styles.detail}>
          Giá thuê: {item.GiaThue.toLocaleString()} VNĐ
        </Text>
        <Text style={styles.detail}>Chứng chỉ: {item.ChungChi}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(item.IDHLV)}
        >
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleReject(item.IDHLV)}
        >
          <Text style={styles.buttonText}>Từ chối</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVerifiedTrainer = ({ item }: { item: PersonalTrainer }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avt }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.HoTen}</Text>
        <Text style={styles.detail}>Địa chỉ: {item.DiaChi}</Text>
        <Text style={styles.detail}>Email: {item.Email}</Text>
        <Text style={styles.detail}>SDT: {item.SDT}</Text>
        <Text style={styles.detail}>Dịch vụ: {item.DichVu}</Text>
        <Text style={styles.detail}>
          Giá thuê: {item.GiaThue.toLocaleString()} VNĐ
        </Text>
        <Text style={styles.detail}>Chứng chỉ: {item.ChungChi}</Text>
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
        <FlatList
          data={trainers}
          renderItem={renderTrainer}
          keyExtractor={(item) => item.IDHLV.toString()}
          ListHeaderComponent={
            <Text >PT đã xác thực</Text>
          }
          ListFooterComponent={
            <FlatList
              data={verifiedTrainers}
              renderItem={renderVerifiedTrainer}
              keyExtractor={(item) => item.IDHLV.toString()}
            />
          }
        />
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
  card: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {
    justifyContent: "space-around",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  rejectButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
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
});
