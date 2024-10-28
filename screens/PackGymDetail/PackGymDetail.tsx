import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout";
import axios from "axios";
import { useRouter } from "expo-router";
import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  View,
  VStack,
  useToast,
} from "native-base";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import RenderHtml from "react-native-render-html";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

interface PackGymDetailScreenProps {
  id: string;
}

interface PackGym {
  IDGoiTap: number;
  TenGoiTap: string;
  ThoiHan: number;
  Gia: number;
}
const screenWidth = Dimensions.get("window").width;

const PackGymDetailScreen: React.FC<PackGymDetailScreenProps> = ({ id }) => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [packgym, setPackgym] = useState<PackGym | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const [image , setImage] = useState<string | null>();

  const fetchPackgym = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/Packgyms/info?id=${id}`
      );
      setPackgym(response.data);
      response.data.TenGoiTap.includes("classic")
        ? setImage("https://i.imgur.com/JyCT4PR.png")
        : setImage("https://i.imgur.com/XO0ARYV.png")
    } catch (err) {
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau! " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Box style={styles.container} w={screenWidth}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : packgym ? (
          <>
            <ImageBackground
              style={styles.ImageBox}
              source={image ? { uri: image } : require('@/assets/images/avatar-trang-4.jpg')}
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
                {packgym.DonGia.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Heading>
              <Heading size={"sm"}>{packgym.TenSP}</Heading>
            </VStack>
            <HStack space={2} px={3} py={3}>
              <Button w={"49%"} onPress={addToCart}>
                Thêm vào giỏ hàng
              </Button>
              <Button w={"49%"}>Mua ngay</Button>
            </HStack>
            <View px={3}>
              <RenderHtml
                source={{ html: packgym.Mota }}
                contentWidth={width}
              />
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

export default PackGymDetailScreen;
