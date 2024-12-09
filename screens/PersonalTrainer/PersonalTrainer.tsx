import React, { useState, useRef, useEffect } from "react";
import { Box, Heading, HStack, Icon, Input, Text, Button } from "native-base";
import { ScrollView, RefreshControl, TouchableWithoutFeedback, Keyboard, View, StyleSheet, TextInput, Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PersonelTrainerItem from "@/components/PersonelTrainerItem/PersonelTrainerItem";
import axios from "axios";
import Constants from "expo-constants";
import { format } from "date-fns";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import BackToTop from "@/components/BackToTop/BackToTop";
import ApplyPT from "./ApplyPT";

const { width: viewportWidth } = Dimensions.get("window");

const PersonalTrainerScreen = () => {
  const [pts, setPts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [errorSchedule, setErrorSchedule] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      const ptsResponse = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/personalTrainer/all`);
      setPts(ptsResponse.data);

      try {
        const schedulesResponse = await axios.get(
          `${Constants.expoConfig?.extra?.API_URL}/personalTrainer/practiceSchedule`,
          {
            headers: {
              PHPSESSID: phpSessId,
              Authorization: `Bearer ${accessToken}`,
              "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
            },
          }
        );
        setSchedules(schedulesResponse.data);
        setErrorSchedule(false);
      } catch (err: any) {
        setErrorSchedule(true);
        console.log("Lỗi khi lấy lịch tập:", err.response?.data);
      }
    } catch (err: any) {
      console.error("Lỗi khi lấy dữ liệu huấn luyện viên:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const getUpcomingSchedules = (schedules: any) => {
    const now = new Date();
    return schedules.filter((schedule: any) => {
      const startDate = new Date(schedule.NgayDangKy);
      return startDate > now;
    });
  };

  const upcomingSchedules = getUpcomingSchedules(schedules);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > 300);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <Box px={5} pt={5}>
        <Heading fontSize="md" mb={3}>
          Lịch Tập Sắp Tới
        </Heading>
        {loading ? (
          <Text>Đang tải dữ liệu...</Text>
        ) : errorSchedule ? (
          <Text>Không có lịch tập sắp tới</Text>
        ) : upcomingSchedules.length > 0 ? (
          upcomingSchedules.map((schedule: any) => (
            <Box
              key={schedule.IDHoaDon}
              p={4}
              mb={4}
              borderRadius="12"
              style={styles.scheduleBox}
            >
              <LinearGradient
                colors={
                  schedule.TrangThai === 0
                    ? ["#FFB6B6", "#FF6666"]
                    : ["#A1F5A1", "#66CC66"]
                }
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradientBox}
              >
                <HStack alignItems="center" space={3} mb={2}>
                  <Icon as={<MaterialCommunityIcons name="calendar" />} size={5} color="white" />
                  <Text color="white" fontWeight="bold" fontSize="sm">
                    Ngày bắt đầu: {format(new Date(schedule.NgayDangKy), "Pp")}
                  </Text>
                </HStack>

                <HStack alignItems="center" space={3} mb={2}>
                  <Icon as={<MaterialCommunityIcons name="calendar-range" />} size={5} color="white" />
                  <Text color="white" fontWeight="bold" fontSize="sm">
                    Ngày hết hạn: {format(new Date(schedule.NgayHetHan), "Pp")}
                  </Text>
                </HStack>

                <HStack alignItems="center" space={3}>
                  <Icon as={<MaterialCommunityIcons name="checkbox-marked-circle" />} size={5} color={schedule.TrangThai === 0 ? "#FF6666" : "#66CC66"} />
                  <Text style={styles.statusText} color="white" fontWeight="bold" fontSize="md">
                    Trạng thái: {schedule.TrangThai === 0 ? "Chưa thanh toán" : "Đã thanh toán"}
                  </Text>
                </HStack>
              </LinearGradient>
            </Box>
          ))
        ) : (
          <Text>Không có lịch tập sắp tới</Text>
        )}
      </Box>

      <Box px={5}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading fontSize="md" mb={5} pt={5}>
            Huấn luyện viên
          </Heading>
          <HStack>
            <Text>Bộ lọc </Text>
            <MaterialCommunityIcons name="filter" size={22} />
          </HStack>
        </HStack>

        {/* Thêm nút Apply */}
        <Button colorScheme="blue" onPress={() => setIsModalOpen(true)}>
          Đăng ký làm việc
        </Button>
      </Box>

      <Box pt={5}>
        {pts.map((pt) => (
          <PersonelTrainerItem pt={pt} key={pt.IDHLV} />
        ))}
      </Box>

      <BackToTop scrollViewRef={scrollViewRef} showButton={showBackToTop} />
      <Box mb={100}></Box>

      {/* Modal ApplyPT */}
      <ApplyPT isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBox: {
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  scheduleBox: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 12,
  },
});

export default PersonalTrainerScreen;
