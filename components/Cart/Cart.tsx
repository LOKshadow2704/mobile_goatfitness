import axios from "axios";
import {
  Button,
  Center,
  Modal,
  Text,
  VStack,
  Image,
  HStack,
  IconButton,
  Checkbox,
  useToast,
} from "native-base";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import PaymentSelect from "../PaymentSelect/PaymentSelect";

type CartProps = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
};

const Cart = ({ showModal, setShowModal }: CartProps) => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const router = useRouter();
  const toast = useToast();
  const [showPaymentSelect, setShowPaymentSelect] = useState(false);

  const fetchCartData = async () => {
    setLoading(true);
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");

    try {
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/cart`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
        }
      );
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [showModal , showPaymentSelect]);

  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = cart.reduce(
        (sum, item) =>
          selectedItems.includes(item.IDSanPham)
            ? sum + item.DonGia * item.SoLuong
            : sum,
        0
      );
      setTotalAmount(total);
    };

    calculateTotalAmount();
  }, [cart, selectedItems]);

  const handleProductDetail = (productId: number) => {
    setShowModal(false);
    router.push(`/Home/tabs/Products/ProductDetail/${productId}`);
  };

  const handleToggleItemSelection = (productId: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(productId)
        ? prevSelectedItems.filter((id) => id !== productId)
        : [...prevSelectedItems, productId]
    );
  };

  const handlePurchaseNow = () => {
    if (selectedItems.length === 0) {
      toast.show({
        description: "Vui lòng chọn ít nhất một sản phẩm để mua!",
        placement: "top",
        style: {
          zIndex: 9999,
        },
      });
    } else {
      setShowPaymentSelect(true);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      const response = await axios.delete(
        `${Constants.expoConfig?.extra?.API_URL}/cart/delete`,
        {
          headers: {
            PHPSESSID: phpSessId,
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`,
          },
          data: { IDSanPham: productId },
        }
      );
      if (response.status === 200) {
        setCart((prevCart) =>
          prevCart.filter((item) => item.IDSanPham !== productId)
        );
        toast.show({
          description: "Sản phẩm đã được xóa khỏi giỏ hàng!",
          placement: "top",
          style: {
            zIndex: 9999,
          },
        });
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.show({
        description: "Có lỗi xảy ra khi xóa sản phẩm!",
        placement: "top",
        style: {
          zIndex: 9999,
        },
      });
    }
  };

  const handleQuantityChange = async (
    productId: number,
    increment: boolean
  ) => {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const phpSessId = await SecureStore.getItemAsync("phpsessid");
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.IDSanPham === productId
          ? {
              ...item,
              SoLuong: increment ? item.SoLuong + 1 : item.SoLuong - 1,
            }
          : item
      )
    );
    try {
      const response = await axios.put(
        `${Constants.expoConfig?.extra?.API_URL}/cart/updateQuan`,
        {
          IDSanPham: productId,
          Quantity: increment ? 1 : -1,
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
        console.log("Số lượng đã được cập nhật thành công:");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      toast.show({
        description: "Có lỗi xảy ra khi cập nhật số lượng!",
        placement: "top",
        style: {
          zIndex: 9999,
        },
      });
    }
  };

  // Tạo body dựa trên các sản phẩm được chọn
  const createBody = () => {
    return {
      products: cart
        .filter((item) => selectedItems.includes(item.IDSanPham))
        .map((item) => ({
          IDSanPham: item.IDSanPham,
          SoLuong: item.SoLuong,
        })),
    };
  };

  return (
    <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size={"xl"}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Giỏ hàng</Modal.Header>
          <Modal.Body>
            {loading ? (
              <Text>Đang tải...</Text>
            ) : cart.length === 0 ? (
              <Text>Giỏ hàng của bạn đang trống.</Text>
            ) : (
              <VStack space={4}>
                {cart.map((item) => (
                  <HStack key={item.IDSanPham} space={3} alignItems="center">
                    <TouchableOpacity
                      onPress={() => handleProductDetail(item.IDSanPham)}
                    >
                      <Image
                        source={{ uri: item.IMG }}
                        alt={item.TenSP}
                        size="50px"
                        borderRadius="md"
                      />
                    </TouchableOpacity>
                    <VStack flex={1}>
                      <Text bold numberOfLines={2} ellipsizeMode="tail">
                        {item.TenSP}
                      </Text>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Text color="gray.500">
                          Giá: {item.DonGia.toLocaleString()} VNĐ
                        </Text>
                        <IconButton
                          icon={<FontAwesomeIcon name="trash" size={20} />}
                          onPress={() => handleRemoveItem(item.IDSanPham)}
                          mr={2}
                        />
                      </HStack>
                      <HStack alignItems="center" space={2}>
                        <IconButton
                          icon={<FontAwesomeIcon name="minus" />}
                          onPress={() =>
                            handleQuantityChange(item.IDSanPham, false)
                          }
                          isDisabled={item.SoLuong <= 1}
                        />
                        <Text>{item.SoLuong}</Text>
                        <IconButton
                          icon={<FontAwesomeIcon name="plus" />}
                          onPress={() =>
                            handleQuantityChange(item.IDSanPham, true)
                          }
                        />
                      </HStack>
                    </VStack>
                    <Checkbox
                      value={item.IDSanPham.toString()}
                      isChecked={selectedItems.includes(item.IDSanPham)}
                      onChange={() => handleToggleItemSelection(item.IDSanPham)}
                      aria-label={`Chọn sản phẩm ${item.TenSP}`}
                    ></Checkbox>
                  </HStack>
                ))}
              </VStack>
            )}
          </Modal.Body>

          <Modal.Footer>
            <VStack justifyContent="space-between" w="100%">
              <Text fontWeight="bold">
                Tổng tiền: {totalAmount.toLocaleString()} VNĐ
              </Text>
              <HStack space={2} justifyContent="flex-end">
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => setShowModal(false)}
                >
                  <Text>Cancel</Text>
                </Button>
                <Button onPress={handlePurchaseNow}>
                  <Text color={"white"}>Mua ngay</Text>
                </Button>
              </HStack>
            </VStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {showPaymentSelect && (
        <PaymentSelect
          showPaymentModal={showPaymentSelect}
          setShowPaymentModal={setShowPaymentSelect}
          type="product"
          body={createBody()}
        />
      )}
    </Center>
  );
};

export default Cart;
