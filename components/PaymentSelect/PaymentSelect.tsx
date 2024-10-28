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
    // route.push('/Home/tabs/Products/PaymentCancle');
    try {
      setLoading(true);
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");
      let endpoint = "";
      if (type === "product") {
        endpoint = `${Constants.expoConfig?.extra?.API_URL}/order`;
      } else if (type === "personalTrainer") {
        endpoint = `${Constants.expoConfig?.extra?.API_URL}/order`;
      } else {
        throw new Error("Loại thanh toán không hợp lệ");
      }

      const response = await axios.post(endpoint, {
        ...body,
        HinhThucThanhToan: payment_code,
      }, {
        headers: {
          PHPSESSID: phpSessId,
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
        },
      });

      if (response.status === 200) {
        await Linking.openURL(response.data.success);
        toast.show({
          description: "Đặt hàng thành công!",
          placement: "top",
          style: {
            zIndex: 9999,
          },
        });
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.show({
        description: "Đã xảy ra lỗi khi đặt hàng!",
        
        style: {
          zIndex: 9999,
        },
      });
    } finally {
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
            onPress={() => handlePayment(2)} // Thanh toán trực tuyến
          >
            Thanh toán trực tuyến
          </Button>
          <Button
            w={"100%"}
            onPress={() => handlePayment(1)} // Thanh toán khi nhận hàng
          >
            Thanh toán khi nhận hàng
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
