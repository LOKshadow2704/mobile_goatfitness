import React, { useState } from "react";
import { Modal, Button, Input, FormControl, Text, Box, VStack, HStack, TextArea, Toast } from "native-base";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const ApplyPT = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [gymService, setGymService] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [certificate, setCertificate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    try {
      setLoading(true);
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      const response = await axios.post(
        `${Constants.expoConfig?.extra?.API_URL}/user/register_pt`,
        {
          DichVu: gymService,
          GiaThue: rentalPrice,
          ChungChi: certificate,
        },
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );

      if (response.status === 200) {
        onClose();
        Toast.show({
            title: "Đăng ký thành công!",
            description: "Yêu cầu đang chờ xét duyệt",
            duration: 3000,
          });
      }
    } catch (error :any) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      console.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Thông tin đăng ký</Modal.Header>
        <Modal.Body>
          {error && <Text color="red.500">{error}</Text>}
          <VStack space={4}>
            <FormControl isRequired>
              <FormControl.Label>Dịch vụ</FormControl.Label>
              <Input
                placeholder="Nhập dịch vụ"
                value={gymService}
                onChangeText={setGymService}
              />
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label>Giá thuê</FormControl.Label>
              <Input
                placeholder="Nhập giá thuê"
                value={rentalPrice}
                onChangeText={setRentalPrice}
                keyboardType="numeric"
              />
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label>Chứng chỉ</FormControl.Label>
              <TextArea
                placeholder="Nhập chứng chỉ"
                value={certificate}
                onChangeText={setCertificate}
                height={100} 
              />
            </FormControl>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <Button
            colorScheme="blue"
            onPress={handleApply}
            isLoading={loading}
            isDisabled={!gymService || !rentalPrice || !certificate}
          >
            Đăng ký
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ApplyPT;
