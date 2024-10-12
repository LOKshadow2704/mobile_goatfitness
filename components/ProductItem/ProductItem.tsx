import React, { useState } from "react";
import {
  Badge, Button, Image, Text, View
} from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Href, useRouter } from "expo-router";

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

  const goToProductDetail = () => {
    if (isNavigating) return; 
    setIsNavigating(true); 
    router.push(`/Home/tabs/Products/ProductDetail/${product.id}`);
    setTimeout(() => {
      setIsNavigating(false); 
    }, 1000); 
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
