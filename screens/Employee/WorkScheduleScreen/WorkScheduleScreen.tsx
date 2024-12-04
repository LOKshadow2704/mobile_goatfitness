import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Schedule {
  Ngay: string;
  desc: string;
  GhiChu: string;
}

const WorkScheduleScreen: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const router = useRouter();


  useEffect(() => {
    const fetchSchedules = async () => {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");
      try {
        const response = await axios.get(
          `${Constants.expoConfig?.extra?.API_URL}/employee/schedule`,
          {
            headers: {
              PHPSESSID: phpSessId || "",
              Authorization: `Bearer ${accessToken || ""}`,
              "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
            },
          }
        );
        setSchedules(response.data);
        setFilteredSchedules(response.data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedules();
  }, []);

  const today = moment().format("YYYY-MM-DD");

  const handleDateConfirm = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setDatePickerVisibility(false);
    filterByDate(formattedDate);
  };

  const handleClearFilter = () => {
    setSelectedDate("");
    setFilteredSchedules(schedules);
  };

  const filterByDate = (date: string) => {
    const newFilteredSchedules = schedules.filter(
      (schedule) => schedule.Ngay === date
    );
    setFilteredSchedules(newFilteredSchedules);
  };

  const renderItem = ({ item }: { item: Schedule }) => {
    const isPast = moment(item.Ngay).isBefore(today, "day");
    const isToday = item.Ngay === today;
    const isFuture = moment(item.Ngay).isAfter(today, "day");

    let highlightStyle;
    if (isPast) {
      highlightStyle = styles.highlightPast;
    } else if (isToday) {
      highlightStyle = styles.highlightToday;
    } else if (isFuture) {
      highlightStyle = styles.highlightFuture;
    }

    return (
      <View style={[styles.item, highlightStyle]}>
        <Text style={styles.dateText}>Ngày: {item.Ngay}</Text>
        <Text style={styles.detailText}>Chi tiết: {item.desc}</Text>
        <Text style={styles.detailText}>Ghi chú: {item.GhiChu}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="exit-to-app" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Lịch làm việc</Text>
      </View>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setDatePickerVisibility(true)}
      >
        <Text style={styles.filterButtonText}>
          {selectedDate ? `Lọc ngày: ${selectedDate}` : "Chọn ngày để lọc"}
        </Text>
      </TouchableOpacity>
      {selectedDate && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearFilter}
        >
          <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={filteredSchedules}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.Ngay}-${index}`}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f9ff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: '12%'
  },
  filterButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    marginBottom: 16,
  },
  filterButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: "#6c757d",
    padding: 8,
    borderRadius: 5,
    marginBottom: 16,
  },
  clearButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
  item: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailText: {
    fontSize: 14,
  },
  highlightPast: {
    backgroundColor: "#d4edda",
    borderColor: "#155724",
    borderWidth: 1,
  },
  highlightToday: {
    backgroundColor: "#fff3cd",
    borderColor: "#856404",
    borderWidth: 1,
  },
  highlightFuture: {
    backgroundColor: "#f8d7da",
    borderColor: "#721c24",
    borderWidth: 1,
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

export default WorkScheduleScreen;
