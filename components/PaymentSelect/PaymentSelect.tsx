import axios from "axios";
import { Button, Modal, useToast } from "native-base";
import Constants from "expo-constants";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Linking } from "react-native";
import { useRouter } from "expo-router";

type PaymentSelectProps = {
  showPaymentModal: boolean;
  setShowPaymentModal: (value: boolean) => void;
  type: string; // 'products' hoặc 'personalTrainer'
  body: object; // Dữ liệu cần thiết cho API
};

export default function PaymentSelect({
  showPaymentModal,
  setShowPaymentModal,
  type,
  body,
}: PaymentSelectProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  // Hàm xử lý thanh toán với mã phương thức thanh toán
  const handlePayment = async (payment_code: number) => {
    try {
      setLoading(true);
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      let endpoint = "";
      if (type === "product") {
        endpoint = `${Constants.expoConfig?.extra?.API_URL}/order`;
      } else if (type === "personalTrainer") {
        endpoint = `${Constants.expoConfig?.extra?.API_URL}/personalTrainer/Register`;
      } else if (type === "gympack") {
        endpoint = `${Constants.expoConfig?.extra?.API_URL}/gympack/register`;
      } else {
        throw new Error("Loại thanh toán không hợp lệ");
      }
      console.log(body)
      const response = await axios.post(
        endpoint,
        {
          ...body,
          HinhThucThanhToan: payment_code,
        },
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );
      console.log(response.data)
      if (response.status === 200) {
        if (payment_code === 2 && response.data?.success) {
          await Linking.openURL(response.data.success);
        } else {
          toast.show({
            description: "Thành công!",
            placement: "top",
          });
        }
      } else {
        throw new Error("Yêu cầu không thành công, vui lòng thử lại.");
      }
    } catch (error: any) {
      console.log(error.response.data)
      const errorMessage =
        error.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.show({
        description: errorMessage,
        style: {
          zIndex: 9999,
        },
      });
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  return (
    <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Chọn phương thức thanh toán</Modal.Header>
        <Modal.Body>
          <Button
            w={"100%"}
            mb={2}
            isLoading={loading}
            onPress={() => handlePayment(2)} // Thanh toán trực tuyến
          >
            Thanh toán trực tuyến
          </Button>
          <Button
            w={"100%"}
            isLoading={loading}
            onPress={() => handlePayment(1)} // Thanh toán khi nhận hàng
          >
            Thanh toán bằng tiền mặt
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
