import React, { useState } from "react";
import {
  Badge, Button, Image, Text, useToast, View
} from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Href, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from 'expo-constants';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface ProductItemProps {
  product: Product;
}


const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false); 
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const goToProductDetail = () => {
    if (isNavigating) return; 
    setIsNavigating(true); 
    router.push(`/Home/tabs/Products/ProductDetail/${product.id}`);
    setTimeout(() => {
      setIsNavigating(false); 
    }, 1000); 
  };

  const addToCart = async () => {
    setLoading(true);
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");

      const response = await axios.post(
        `${Constants.expoConfig?.extra?.API_URL}/cart/add`, // API endpoint to add to cart
        { "IDSanPham": product.id},
        {
          headers: {
            "PHPSESSID": phpSessId,
            "Authorization": `Bearer ${accessToken}`,
            "User-Agent": `${Constants.expoConfig?.extra?.AGENT}`
          },
        }
      );
      if (response.status === 200) {
        toast.show({
          description: "Sản phẩm đã được thêm vào giỏ hàng!",
          placement: "top",
          style: { marginTop: 30 }
        });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.show({
        description: "Có lỗi xảy ra. Vui lòng thử lại.",
        bgColor: "danger",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <TouchableOpacity onPress={goToProductDetail}>
      <View style={styles.itemContainer} px={2} py={5}>
        <Image source={{ uri: product.image }} style={styles.image} alt="" />
        <Text style={styles.name} numberOfLines={3}>{product.name}</Text>
        <Badge colorScheme="success" style={styles.price}>
          {`Đơn giá: ${Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(product.price)}`}
        </Badge>
        <Button
          mt={2}
          bg="amber.400"
          _text={{
            color: "black",
            fontSize: "xs",
            fontWeight: "normal",
            textAlign: "center",
          }}
          _pressed={{ bg: "amber.600" }}
          _hover={{ bg: "amber.500" }}
          shadow={2}
          style={styles.button}
          onPress={addToCart}
        >
          Thêm vào giỏ hàng
        </Button>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  name: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  price: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: "500",
    backgroundColor: "#dff0d8",
    color: "#3c763d",
    textAlign: "center",
    width: '100%',
  },
  button: {
    justifyContent: "center",
    width: '100%',
  },
});

export default ProductItem;
