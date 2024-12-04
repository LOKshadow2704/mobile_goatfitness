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
  const [scheduleData, setScheduleData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSchedule = async () => {
    setLoading(true);
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
        setScheduleData(response.data);
      } else {
        alert("Không thể lấy lịch tập. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lịch tập:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSchedule();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <Modal.Content maxWidth="400px" borderRadius="lg" bg="white">
        <Modal.CloseButton />
        <Modal.Header bg="blue.600" borderRadius="lg">
          <Text color="white" fontSize="lg" fontWeight="bold">
            Lịch tập
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
          ) : scheduleData.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {scheduleData.map((item, index) => (
                <Box
                  key={index}
                  p={4}
                  bg="gray.100"
                  borderRadius="md"
                  mb={4}
                  shadow={2}
                  borderColor="gray.200"
                  borderWidth={1}
                >
                  <Text fontWeight="bold" color="blue.600" mb={1}>
                    Ngày đăng ký:
                  </Text>
                  <Text color="gray.600">{item.NgayDangKy}</Text>
                  <Divider my={2} />
                  <Text fontWeight="bold" color="blue.600" mb={1}>
                    Ngày hết hạn:
                  </Text>
                  <Text color="gray.600">{item.NgayHetHan}</Text>
                  <Divider my={2} />
                  <Text fontWeight="bold" color="blue.600" mb={1}>
                    Trạng thái thanh toán:
                  </Text>
                  <Text color="gray.600">{item.TrangThaiThanhToan}</Text>
                  <Divider my={2} />
                  <Text fontWeight="bold" color="blue.600" mb={1}>
                    Trạng thái:
                  </Text>
                  <Text color={item.TrangThai ? "green.600" : "red.600"}>
                    {item.TrangThai ? "Hoàn thành" : "Chưa hoàn thành"}
                  </Text>
                </Box>
              ))}
            </ScrollView>
          ) : (
            <Center>
              <Text color="gray.600">Không có lịch tập.</Text>
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
