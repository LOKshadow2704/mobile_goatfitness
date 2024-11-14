import React, { useState, useRef, useEffect } from "react";
import { Box, Heading, HStack, Icon, Input, Text } from "native-base";
import {
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import PersonelTrainerItem from "@/components/PersonelTrainerItem/PersonelTrainerItem";
import axios from "axios";
import Constants from "expo-constants";
import { format } from "date-fns";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import BackToTop from "@/components/BackToTop/BackToTop"; // Import component BackToTop

const { width: viewportWidth } = Dimensions.get("window");

const PersonalTrainerScreen = () => {
  const [pts, setPts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false); // State để quản lý nút BackToTop
  const [errorSchedule, setErrorSchedule] = useState(false); // State kiểm tra lỗi API lịch tập
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef(null); // Ref cho ScrollView

  // Hàm lấy dữ liệu từ API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      // Fetching PT data
      const ptsResponse = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/personalTrainer/all`
      );
      setPts(ptsResponse.data);

      // Fetching practice schedule data
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
        setErrorSchedule(false); // Reset error state nếu thành công
      } catch (err:any) {
        setErrorSchedule(true); // Đặt state lỗi nếu API trả lỗi
        console.log("Lỗi khi lấy lịch tập:", err.response?.data );
      }
    } catch (err:any) {
      console.error("Lỗi khi lấy dữ liệu huấn luyện viên:", err.response?.data );
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

  // Hàm xử lý sự kiện cuộn (scroll) để hiển thị nút BackToTop
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > 300); // Hiển thị nút khi cuộn xuống hơn 300px
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={handleScroll} // Xử lý sự kiện cuộn
      scrollEventThrottle={16} // Cập nhật mỗi 16ms
    >
      <Box px={5} pt={5}>
        <Heading fontSize="md" mb={3}>
          Lịch Tập Sắp Tới
        </Heading>
        {loading ? (
          <Text>Đang tải dữ liệu...</Text>
        ) : errorSchedule ? (
          <Text>Không có lịch tập sắp tới</Text> // Hiển thị thông báo lỗi nếu API lịch tập gặp sự cố
        ) : upcomingSchedules.length > 0 ? (
          upcomingSchedules.map((schedule: any) => (
            <Box
              key={schedule.IDHoaDon}
              p={4}
              mb={4}
              borderRadius="12"
              style={styles.scheduleBox} // Áp dụng hiệu ứng bóng đổ
            >
              <LinearGradient
                colors={ 
                  schedule.TrangThai === 0
                    ? ["#FFB6B6", "#FF6666"] // Màu gradient cho trạng thái chưa thanh toán
                    : ["#A1F5A1", "#66CC66"] // Màu gradient cho trạng thái đã thanh toán
                }
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradientBox}
              >
                <HStack alignItems="center" space={3} mb={2}>
                  <Icon
                    as={<MaterialCommunityIcons name="calendar" />}
                    size={5}
                    color="white"
                  />
                  <Text color="white" fontWeight="bold" fontSize="sm">
                    Ngày bắt đầu: {format(new Date(schedule.NgayDangKy), "Pp")}
                  </Text>
                </HStack>

                <HStack alignItems="center" space={3} mb={2}>
                  <Icon
                    as={<MaterialCommunityIcons name="calendar-range" />}
                    size={5}
                    color="white"
                  />
                  <Text color="white" fontWeight="bold" fontSize="sm">
                    Ngày hết hạn: {format(new Date(schedule.NgayHetHan), "Pp")}
                  </Text>
                </HStack>

                <HStack alignItems="center" space={3}>
                  <Icon
                    as={
                      <MaterialCommunityIcons name="checkbox-marked-circle" />
                    }
                    size={5}
                    color={schedule.TrangThai === 0 ? "#FF6666" : "#66CC66"}
                  />
                  <Text
                    style={styles.statusText}
                    color="white"
                    fontWeight="bold"
                    fontSize="md"
                  >
                    Trạng thái:{" "}
                    {schedule.TrangThai === 0
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }}>
            <Input
              ref={inputRef}
              placeholder="Tìm kiếm"
              width="100%"
              borderRadius="4"
              py="2"
              px="1"
              fontSize="12"
              InputLeftElement={
                <Icon
                  m="2"
                  ml="3"
                  size="4"
                  color="gray.400"
                  as={<FontAwesome5 name="search" />}
                />
              }
            />
          </View>
        </TouchableWithoutFeedback>
      </Box>

      <Box pt={5}>
        {pts.map((pt) => (
          <PersonelTrainerItem pt={pt} key={pt.IDHLV} />
        ))}
      </Box>

      {/* Thêm component BackToTop */}
      <BackToTop scrollViewRef={scrollViewRef} showButton={showBackToTop} />
      <Box mb={100}></Box>
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
