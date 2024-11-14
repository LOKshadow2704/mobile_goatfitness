import React, { useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Text,
  View,
  VStack,
} from "native-base";
import { SCREEN_WIDTH } from "@/assets/diminsons/diminsons";
import { Image, ScrollView, StyleSheet } from "react-native";
import ProductItem from "@/components/ProductItem/ProductItem";
import QRCodeModal from "@/components/QRCodeModal/QRCodeModal";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

const HomeContentsScreen = () => {
  const [isQRCodeVisible, setQRCodeVisible] = useState(false);
  const [qrCodeTimeoutId, setQrCodeTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

  const products = [
    {
      id: "1",
      name: "Găng tay Aolike Gloves Pro Wrist Wrap",
      price: 20000,
      image: "https://i.imgur.com/vICs0bu.png",
    },
    // Thêm sản phẩm khác nếu cần...
  ];

  // Hàm render grid sản phẩm
  const renderGrid = (items: Product[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      const pair = [items[i], items[i + 1]];
      rows.push(
        <HStack space={2} style={styles.row} key={`row-${i}`}>
          {pair.map((prod, idx) =>
            prod ? (
              <VStack key={prod.id} style={styles.col}>
                <ProductItem product={prod} />
              </VStack>
            ) : (
              <View key={`placeholder-${i}-${idx}`} style={styles.col} />
            )
          )}
        </HStack>
      );
    }
    return rows;
  };

  // Hàm check-in và hiển thị QR code sau khi xác thực vân tay thành công
  const handleCheckIn = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Xác thực vân tay để tạo mã QR",
      });
      if (result.success) {
        setQRCodeVisible(true);
        const timeoutId = setTimeout(() => setQRCodeVisible(false), 60000);
        setQrCodeTimeoutId(timeoutId);
      } else {
        alert("Xác thực thất bại! Vui lòng thử lại.");
      }
    } else {
      alert("Thiết bị không hỗ trợ hoặc chưa cài đặt vân tay.");
    }
  };

  const handleCloseQRCodeModal = () => {
    setQRCodeVisible(false);
    if (qrCodeTimeoutId) {
      clearTimeout(qrCodeTimeoutId);
      setQrCodeTimeoutId(null);
    }
  };

  const userInfo = JSON.stringify({
    name: "Nguyễn Thành Lộc",
    hoursTrained: 20,
    userId: "12345",
    phone: "0987654321",
    email: "lucloc@example.com",
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box flex={1} style={styles.container}>
        <Box style={styles.container_item}>
          <HStack space={8}>
            <Center>
              <VStack space={5} pl={5}>
                <Text color="#fff">
                  Luyện tập thôi{" "}
                  <FontAwesome6 name="fire" size={20} color="red" />
                </Text>
                <Button
                  w="120"
                  rightIcon={<FontAwesome6 name="right-long" size={20} />}
                  onPress={handleCheckIn}
                >
                  Check in
                </Button>
              </VStack>
            </Center>
            <Image
              source={require("../../assets/images/box_1_home.png")}
              style={styles.container_item_image}
            />
          </HStack>
        </Box>

        <View style={styles.container_item_4}>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            space={5}
            mb={5}
            pl={2}
          >
            <Heading size="xs">Sản phẩm gợi ý</Heading>
            <Button size="sm" variant="link" colorScheme="primary">
              Xem thêm
            </Button>
          </HStack>
          {renderGrid(products)}
        </View>

        <QRCodeModal
          visible={isQRCodeVisible}
          onClose={handleCloseQRCodeModal}
          userInfo={userInfo}
        />
      </Box>
      <Box mb={100}></Box>
    </ScrollView>
  );
};

export default HomeContentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  container_item: {
    marginTop: 20,
    height: 150,
    width: "90%",
    backgroundColor: "#27272a",
    borderRadius: 20,
    padding: 20,
  },
  container_item_image: {
    height: 100,
    width: 100,
  },
  container_item_4: {
    width: "90%",
    marginTop: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginBottom: 10,
  },
  col: {
    flex: 1,
  },
});
