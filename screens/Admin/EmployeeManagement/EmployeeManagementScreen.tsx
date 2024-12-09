import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { fetchAllEmployees, fetchEmployeeSchedules } from "./api";
import { MaterialIcons } from "@expo/vector-icons";
import ModalAddSchedule from "./ModalAddSchedule";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { Box } from "native-base";
import { router, useRouter } from "expo-router";

const EmployeeManagementScreen = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const loadData = async () => {
    try {
      const employeeData = await fetchAllEmployees();
      setEmployees(employeeData);
      setFilteredEmployees(employeeData); 
      const scheduleData = await fetchEmployeeSchedules();
      setSchedules(scheduleData);
      setFilteredSchedules(scheduleData);
    } catch (error) {
      console.error("Error loading data:", error);
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

  const filterSchedulesByDate = (date: string) => {
    if (date) {
      const filtered = schedules.filter((schedule) => schedule.Ngay === date);
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(schedules);
    }
  };

  const handleDateConfirm = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);
    filterSchedulesByDate(formattedDate);
    setDatePickerVisible(false);
  };

  const handleSaveSchedule = (date: string, shift: number, note: string) => {
    const newSchedule = { date, shift, note };
    const newSchedules = [...schedules, newSchedule];
    setSchedules(newSchedules);
    filterSchedulesByDate(selectedDate);
  };

  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.HoTen.toLowerCase().includes(query.toLowerCase()) ||
          employee.TenDangNhap.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="exit-to-app" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Quản lý Nhân Viên</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm nhân viên - Họ tên"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Date Picker Button */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedDate ? `Ngày: ${selectedDate}` : "Chọn ngày"}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Employee List */}
          <Text style={styles.sectionTitle}>Danh sách nhân viên</Text>
          {filteredEmployees.map((employee, index) => (
            <View style={styles.card} key={index}>
              <Text style={styles.name}>
                {employee.HoTen} ({employee.TenDangNhap})
              </Text>
              <Text style={styles.text}>SĐT: {employee.SDT}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setModalVisible(true);
                  setSelectedEmp(employee.TenDangNhap);
                }}
              >
                <Text style={styles.buttonText}>Thêm lịch làm việc</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Employee Schedules */}
          <Text style={styles.sectionTitle}>Lịch làm việc của nhân viên</Text>
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule, index) => (
              <View style={styles.card} key={index}>
                <Text style={styles.text}>Ngày: {schedule.Ngay}</Text>
                <Text style={styles.text}>Ca: {schedule.Ca}</Text>
                <Text style={styles.text}>Tên: {schedule.HoTen}</Text>
                <Text style={styles.text}>Ghi chú: {schedule.GhiChu}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Không có lịch cho ngày {selectedDate}
            </Text>
          )}
        </ScrollView>
      )}

      <ModalAddSchedule
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveSchedule}
        employeeUsername={selectedEmp}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />
      <Box pb={70}></Box>
    </View>
  );
};

const colors = {
  primary: "#4CAF50",
  secondary: "#007bff",
  background: "#f8f9fa",
  card: "#ffffff",
  text: "#212529",
  shadow: "#6c757d",
  button: "#28a745",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f9ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.button,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  backButton: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  filterContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  dateButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  searchContainer: {
    marginVertical: 10,
    width: "100%",
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default EmployeeManagementScreen;
