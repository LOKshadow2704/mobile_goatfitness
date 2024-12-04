import React, { useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import QRCodeModal from "@/components/QRCodeModal/QRCodeModal";
import * as LocalAuthentication from "expo-local-authentication";

// Dữ liệu quảng cáo dịch vụ và khuyến mãi
const services = [
  {
    id: "1",
    title: "Lớp Yoga cho mọi cấp độ",
    description:
      "Khám phá các lớp Yoga cho tất cả các cấp độ, giúp bạn cải thiện sức khỏe và tinh thần. Tham gia ngay hôm nay để cảm nhận sự khác biệt!",
    image: "https://i.imgur.com/MzkR2X7.jpg",
    price: "1,000,000 VND/tháng", // Tăng giá
  },
  {
    id: "3",
    title: "Lớp Zumba vui nhộn",
    description:
      "Tham gia lớp Zumba để vừa giảm cân vừa giải trí. Cảm nhận năng lượng và sự vui vẻ mỗi buổi học.",
    image: "https://i.imgur.com/FvQLByj.jpg",
    price: "800,000 VND/tháng", // Tăng giá
  },
  {
    id: "4",
    title: "Khóa học HIIT giảm mỡ hiệu quả",
    description:
      "Khóa học HIIT giúp bạn đốt cháy calo, giảm mỡ hiệu quả. Đừng bỏ lỡ chương trình khuyến mãi đặc biệt!",
    image: "https://i.imgur.com/7YH5Z9z.jpg",
    price: "1,200,000 VND/tháng", // Tăng giá
  },
];

const HomeContentsScreen = () => {
  const [isQRCodeVisible, setQRCodeVisible] = useState(false);
  const [qrCodeTimeoutId, setQrCodeTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

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

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box flex={1} style={styles.container}>
        {/* Phần Luyện tập thôi vẫn giữ nguyên */}
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

        {/* Khuyến mãi với LinearGradient */}
        <LinearGradient
          colors={["#1f2a44", "#4a6ea6"]} // Gradient xanh đen đến xanh dương
          style={styles.promotionBox}
        >
          <Heading size="sm" color="white" mb={2}>
            Khuyến mãi đặc biệt
          </Heading>
          <Text color="white" mb={3}>
            - Giảm giá lên đến 10% cho tất cả sản phẩm!
          </Text>
          <Text color="white" mb={3}>
            - Gói tập đăng ký càng nhiều, tiết kiệm càng lớn!
          </Text>
          <Text color="white" fontWeight="bold">
            Đừng bỏ lỡ cơ hội này! Hãy đăng ký ngay hôm nay!
          </Text>
        </LinearGradient>

        {/* Quảng cáo dịch vụ */}
        <View style={styles.container_item_4}>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            space={5}
            mb={5}
            pl={2}
          >
            <Heading size="xs">Dịch vụ nổi bật</Heading>
            <Button size="sm" variant="link" colorScheme="primary">
              Xem thêm
            </Button>
          </HStack>
          {services.map((service) => (
            <Box
              key={service.id}
              p={4}
              mb={3}
              borderRadius="md"
              bg="gray.100"
              shadow={1}
            >
              <Image
                source={{ uri: service.image }}
                style={{ width: "100%", height: 150, borderRadius: 10 }}
              />
              <Text fontWeight="bold" color="blue.600" mt={3}>
                {service.title}
              </Text>
              <Text color="gray.700">{service.description}</Text>
              <Text fontWeight="bold" color="green.600" mt={2}>
                {service.price}
              </Text>
              <Text color="blue.700" mt={2}>
                Liên hệ đăng ký: <Text fontWeight="bold">0328058832</Text>
              </Text>
            </Box>
          ))}
        </View>
      </Box>
      <QRCodeModal visible={isQRCodeVisible} onClose={handleCloseQRCodeModal} />
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
  promotionBox: {
    width: "90%",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});
