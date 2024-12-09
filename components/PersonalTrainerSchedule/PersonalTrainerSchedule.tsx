import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  ScrollView,
  Text,
  VStack,
  Center,
  Spinner,
  Divider,
} from "native-base";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

interface PersonalTrainerScheduleProps {
  isOpen: boolean;
  onClose: () => void;
}

const PersonalTrainerSchedule: React.FC<PersonalTrainerScheduleProps> = ({
  isOpen,
  onClose,
}) => {
  const [trainerData, setTrainerData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any[]>([
    {
      "IDHoaDon": 58,
      "IDKhachHang": 23,
      "TrangThaiThanhToan": "chưa thanh toán",
      "NgayDangKy": "2024-12-02 08:00:00",
      "NgayHetHan": "2024-12-02 09:00:00",
      "TrangThai": 0,
      "HoTen": "Nguyễn Thành Lộc",
      "SDT": "0123456777",
    },
    {
      "IDHoaDon": 61,
      "IDKhachHang": 23,
      "TrangThaiThanhToan": "Chưa thanh toán",
      "NgayDangKy": "2024-12-07 17:00:00",
      "NgayHetHan": "2024-12-07 18:00:00",
      "TrangThai": 0,
      "HoTen": "Nguyễn Thành Lộc",
      "SDT": "0123456777",
    },
    {
      "IDHoaDon": 64,
      "IDKhachHang": 23,
      "TrangThaiThanhToan": "Chưa thanh toán",
      "NgayDangKy": "2024-12-08 08:00:00",
      "NgayHetHan": "2024-12-08 09:00:00",
      "TrangThai": 0,
      "HoTen": "Nguyễn Thành Lộc",
      "SDT": "0123456777",
    },
    {
      "IDHoaDon": 65,
      "IDKhachHang": 23,
      "TrangThaiThanhToan": "Chưa thanh toán",
      "NgayDangKy": "2024-12-09 19:00:00",
      "NgayHetHan": "2024-12-09 20:00:00",
      "TrangThai": 0,
      "HoTen": "Nguyễn Thành Lộc",
      "SDT": "0123456777",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingApproval, setPendingApproval] = useState<boolean>(false);

  // Lấy yêu cầu huấn luyện viên
  const fetchTrainerData = async () => {
    setLoading(true);
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/user/register_pt/see`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setPendingApproval(data);
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 500) {
          fetchTrainerSchedule();
        } else {
          console.log("Lỗi khác:", error.response?.data);
          alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
      } else {
        console.log("Lỗi không xác định:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Lấy lịch tập của huấn luyện viên
  const fetchTrainerSchedule = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/personalTrainer/schedule`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );
      if (response.status === 200) {
        setScheduleData(response.data); // Lưu dữ liệu lịch tập vào state
        console.log(response.data);
      }
    } catch (error: any) {
      console.log("Error fetching schedule:", error.response?.data);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTrainerData(); // Lấy thông tin huấn luyện viên khi modal mở
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <Modal.Content maxWidth="400px" borderRadius="lg" bg="white">
        <Modal.CloseButton />
        <Modal.Header bg="blue.600" borderRadius="lg">
          <Text color="white" fontSize="lg" fontWeight="bold">
            Thông tin huấn luyện viên
          </Text>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Center>
              <Spinner size="lg" color="blue.600" />
              <Text mt={2} color="gray.500">
                Đang tải...
              </Text>
            </Center>
          ) : pendingApproval ? (
            <Center>
              <Text color="gray.600">Bạn đang đợi phê duyệt.</Text>
            </Center>
          ) : scheduleData.length > 0 ? (
            <VStack space={4}>
              {scheduleData.map((schedule, index) => (
                <Box key={index} p={2} borderRadius="md" borderWidth={1} mb={2}>
                  <Text fontWeight="bold" color="blue.600">
                    Lịch tập:
                  </Text>
                  <Text color="gray.600">
                    {schedule.NgayDangKy} - {schedule.NgayHetHan}
                  </Text>
                  <Text color="gray.600">
                    Trạng thái thanh toán: {schedule.TrangThaiThanhToan}
                  </Text>
                  <Text color="gray.600">
                    Khách hàng: {schedule.HoTen} - Số điện thoại: {schedule.SDT}
                  </Text>
                  <Divider my={2} />
                </Box>
              ))}
            </VStack>
          ) : (
            <Center>
              <Text color="gray.600">Chưa có lịch tập.</Text>
            </Center>
          )}
        </Modal.Body>
        <Modal.Footer bg="gray.50" borderTopRadius="lg">
          <Button onPress={onClose} colorScheme="blue" width="100%">
            Đóng
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default PersonalTrainerSchedule;
