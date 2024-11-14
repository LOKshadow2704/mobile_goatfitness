import React, { useEffect, useState, useCallback, useRef } from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import {
  Heading,
  Text,
  Button,
  Modal,
  HStack,
  Divider,
  VStack,
  Box,
} from "native-base";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import PackGymItem from "@/components/PackGymItem/PackGymItem";
import BackToTop from "@/components/BackToTop/BackToTop";

interface PackGym {
  IDGoiTap: number;
  TenGoiTap: string;
  ThoiHan: number;
  Gia: number;
}

interface UserPack {
  IDGoiTap: number;
  TenGoiTap: string;
  NgayBatDau: string;
  NgayKetThuc: string;
}

interface UserPackDate {
  IDHoaDon: number;
  IDGoiTap: number;
  NgayDangKy: string;
  NgayHetHan: string;
  info: UserPack;
  TrangThaiThanhToan: string;
}

const PackGymScreen = () => {
  const [userPack, setUserPack] = useState<UserPack | null>(null);
  const [billInfo, setBillInfo] = useState<UserPackDate | null>(null);
  const [data, setData] = useState<PackGym[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hide, setHide] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState(false); // State to control the visibility of the Back to Top button
  const scrollViewRef = useRef<ScrollView>(null); // Ref for ScrollView

  // Hàm lấy dữ liệu gói tập hiện tại của người dùng
  const fetchUserCurrentPack = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/gympack/user`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );
      setUserPack(response.data.info);
      setBillInfo(response.data);
      setHide(true);
    } catch (err: any) {
      setUserPack(null);
      setHide(false);
    }
  };

  // Hàm lấy dữ liệu các gói tập
  const fetchPackGym = async () => {
    try {
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/gympack`
      );
      setData(response.data);
    } catch (err: any) {
      console.error("fetchPackGym Error:", err.message);
      setError("Không thể tải danh sách Gói tập. Vui lòng thử lại sau!");
    }
  };

  // Hàm khởi tạo dữ liệu và làm mới toàn bộ khi người dùng kéo để làm mới
  const initializeData = async () => {
    setLoading(true);
    await fetchUserCurrentPack();
    await fetchPackGym();
    setLoading(false);
  };

  // Hàm gọi lại khi làm mới
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeData();
    setRefreshing(false);
  }, []);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > 300);
  };

  // Gọi hàm khởi tạo dữ liệu khi màn hình được tải
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <Button
        mt={2}
        bg="primary.500"
        _text={{
          color: "white",
          fontSize: "xs",
          fontWeight: "bold",
        }}
        onPress={() => setShowModal(true)}
        my={5}
      >
        Xem các đặc quyền
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size={"full"}
      >
        <Modal.Content maxWidth="90%" maxHeight="80%">
          <Modal.CloseButton />
          <Modal.Header>Các Đặc Quyền</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <HStack justifyContent="space-between" mb={3}>
                <Text bold w={"60%"}>
                  Đặc quyền
                </Text>
                <Text bold>Classic</Text>
                <Text bold>Royal</Text>
              </HStack>

              <Divider />

              <HStack justifyContent="space-between" py={2}>
                <Text w={"60%"}>Tập luyện tại 01 CLB đã chọn</Text>
                <Text>✅</Text>
                <Text>✅</Text>
              </HStack>

              <Divider />

              <HStack justifyContent="space-between" py={2}>
                <Text w={"60%"}>Miễn phí buổi tập với HLV</Text>
                <Text>❌</Text>
                <Text>✅</Text>
              </HStack>

              <Divider />

              <HStack justifyContent="space-between" py={2}>
                <Text w={"60%"}>Sử dụng phòng xông hơi</Text>
                <Text>❌</Text>
                <Text>✅</Text>
              </HStack>

              <Divider />

              <HStack justifyContent="space-between" py={2}>
                <Text w={"60%"}>Truy cập khu vực VIP</Text>
                <Text>❌</Text>
                <Text>✅</Text>
              </HStack>

              <Divider />

              <HStack justifyContent="space-between" py={2}>
                <Text w={"60%"}>Giảm giá dịch vụ spa</Text>
                <Text>❌</Text>
                <Text>✅</Text>
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={() => setShowModal(false)}>Đóng</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {loading ? (
        <Text>Đang tải dữ liệu...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <>
          {userPack && billInfo && (
            <LinearGradient
              colors={["#4c669f", "#3b5998", "#192f6a"]}
              style={styles.gradientBox}
            >
              <Heading fontSize="md" color="white">
                Gói tập hiện tại của bạn
              </Heading>
              <Text color="white">Gói: {userPack.TenGoiTap}</Text>
              <Text color="white">
                Ngày bắt đầu:{" "}
                {new Date(billInfo.NgayDangKy).toLocaleDateString()}
              </Text>
              <Text color="white">
                Ngày kết thúc:{" "}
                {new Date(billInfo.NgayHetHan).toLocaleDateString()}
              </Text>
              <Text color="white">
                Trạng thái: {billInfo.TrangThaiThanhToan}
              </Text>
            </LinearGradient>
          )}

          <Heading fontSize="md">Đăng ký càng lâu, ưu đãi càng lớn</Heading>
          {data ? (
            data.map((item) => (
              <PackGymItem packgym={item} key={item.IDGoiTap} hide={hide} />
            ))
          ) : (
            <Text>Không có dữ liệu</Text>
          )}
        </>
      )}

      {/* Nút Back to Top */}
      {showBackToTop && (
        <BackToTop scrollViewRef={scrollViewRef} showButton={showBackToTop} />
      )}
      <Box mb={100}></Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  gradientBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  backToTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4c669f",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  backToTopText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PackGymScreen;
