import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout";
import axios from "axios";
import { useRouter } from "expo-router";
import { Box, Button, Heading, HStack, Text, View, VStack, useToast } from "native-base";
import React, { useEffect, useState } from "react";
import { Dimensions, ImageBackground, StyleSheet, useWindowDimensions } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Constants from "expo-constants"; 
import * as SecureStore from "expo-secure-store";

interface ProductDetailScreenProps {
  id: string;
}

interface Product {
  IDSanPham: number;
  TenSP: string;
  Mota: string;
  DonGia: number;
  IMG: string;
  SoLuong: number;
}

const screenWidth = Dimensions.get("window").width;

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ id }) => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/products/info?IDSanPham=${id}`
      );
      setProduct(response.data);
    } catch (err) {
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau! " + err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm vào giỏ hàng
  const addToCart = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const phpSessId = await SecureStore.getItemAsync("phpsessid");
      if (!product) return;

      const response = await axios.post(
        `${Constants.expoConfig?.extra?.API_URL}/cart/add`, // API endpoint to add to cart
        { "IDSanPham": product.IDSanPham },
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
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <DefaultLayout>
      <Box style={styles.container} w={screenWidth}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : product ? (
          <>
            <ImageBackground
              style={styles.ImageBox}
              source={{ uri: product.IMG }}
              resizeMode="center"
            >
              <Button
                leftIcon={
                  <FontAwesomeIcon
                    name="angle-double-left"
                    style={{ color: "#fff" }}
                  />
                }
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                w={20}
                onPress={() => router.back()}
              >
                Quay lại
              </Button>
            </ImageBackground>
            <VStack px={3} space={2}>
              <Heading pt={3} style={{ color: "#ea580c" }}>
                {product.DonGia.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Heading>
              <Heading size={"sm"}>{product.TenSP}</Heading>
            </VStack>
            <HStack space={2} px={3} py={3}>
              <Button w={"49%"} onPress={addToCart}>Thêm vào giỏ hàng</Button>
              <Button w={"49%"}>Mua ngay</Button>
            </HStack>
            <View px={3}>
              {/* Thay thế RenderHtml bằng Text để hiển thị mô tả sản phẩm */}
              <Text>{product.Mota}</Text>
            </View>
          </>
        ) : (
          <Text>Không có dữ liệu sản phẩm</Text>
        )}
      </Box>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  SafeAreaView: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "red",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ImageBox: {
    height: 200,
  },
});

export default ProductDetailScreen;
