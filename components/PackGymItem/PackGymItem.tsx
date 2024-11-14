import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Badge, Box, Button, HStack, Image, Text, View } from "native-base";
import { StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";
import PaymentSelect from "@/components/PaymentSelect/PaymentSelect";

interface PackGymItem {
  IDGoiTap: number;
  TenGoiTap: string;
  ThoiHan: number;
  Gia: number;
}

interface PackGymItemProps {
  packgym: PackGymItem;
  hide: boolean;
}

const PackGymItem: React.FC<PackGymItemProps> = ({ packgym, hide }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPaymentSelect, setShowPaymentSelect] = useState(false);

  const imageUrl = packgym.TenGoiTap.includes("classic")
    ? "https://i.imgur.com/JyCT4PR.png"
    : "https://i.imgur.com/XO0ARYV.png";

  // Tạo dữ liệu body để truyền vào PaymentSelect
  const createBody = () => ({
    IDGoiTap: packgym.IDGoiTap
  });

  return (
    <View style={styles.itemContainer} px={2} py={5} my={2}>
      <HStack justifyContent="space-between" alignItems="center">
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          alt={packgym.TenGoiTap}
        />
        <Box flex={1} ml={3}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text style={styles.name}>{packgym.TenGoiTap}</Text>
            <Text style={styles.priceText}>{packgym.ThoiHan} ngày</Text>
          </HStack>

          <Badge
            colorScheme="success"
            style={styles.price}
            flexDirection="row"
            flexWrap="nowrap"
          >
            <Text numberOfLines={1} style={styles.priceText}>
              {`Giá gói: ${Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(packgym.Gia)}`}
            </Text>
          </Badge>
        </Box>
      </HStack>

      <Button
        mt={3}
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
        isDisabled={hide || loading}
        onPress={() => setShowPaymentSelect(true)} // Hiển thị modal PaymentSelect
      >
        {loading ? "Đang tải..." : "Đăng ký ngay"}
      </Button>

      {/* Hiển thị modal chọn phương thức thanh toán */}
      {showPaymentSelect && (
        <PaymentSelect
          showPaymentModal={showPaymentSelect}
          setShowPaymentModal={setShowPaymentSelect}
          type="gympack"
          body={createBody()}
        />
      )}
    </View>
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
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: "500",
    backgroundColor: "#dff0d8",
    color: "#3c763d",
    textAlign: "center",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "nowrap",
    maxWidth: "100%",
    overflow: "hidden",
    flexShrink: 1,
    minWidth: 0,
  },
  priceText: {
    color: "#3c763d",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
  },
  button: {
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
});

export default PackGymItem;
