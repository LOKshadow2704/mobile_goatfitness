import { API_URL } from "@env";
import axios from "axios";
import { Button, Center, Modal, Text, VStack, Image, HStack } from "native-base";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { AGENT } from '@env';

type CartProps = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
};

const Cart = ({ showModal, setShowModal }: CartProps) => {
  const [cart, setCart] = useState<any[]>([]); // Thay đổi kiểu dữ liệu thành mảng
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      const accessToken = await SecureStore.getItemAsync("access_token");
      const refreshToken = await SecureStore.getItemAsync("refresh_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      try {
        const response = await axios.get(`${API_URL}/cart`, {
          headers: {
            'PHPSESSID': phpSessId,
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': `${AGENT}`,
          }
        });
        setCart(response.data); // Lưu trữ dữ liệu giỏ hàng
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  return (
    <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Giỏ hàng</Modal.Header>
          <Modal.Body>
            {loading ? (
              <Text>Đang tải...</Text>
            ) : (
              <VStack space={4}>
                {cart.map((item) => (
                  <HStack key={item.IDSanPham} space={3} alignItems="center">
                    <Image
                      source={{ uri: item.IMG }}
                      alt={item.TenSP}
                      size="50px"
                      borderRadius="md"
                    />
                    <VStack>
                      <Text bold>{item.TenSP}</Text>
                      <Text color="gray.500">Giá: {item.DonGia.toLocaleString()} VNĐ</Text>
                      <Text color="gray.500">Số lượng: {item.SoLuong}</Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default Cart;
