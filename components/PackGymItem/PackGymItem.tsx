import { Badge, Box, Button, HStack, Image, Text, View } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";

interface PackGymItem {
  IDGoiTap: number,
  TenGoiTap: string,
  ThoiHan: number,
  Gia: number
}

interface PackGymItemProps {
  packgym: PackGymItem;
}

const PackGymItem: React.FC<PackGymItemProps> = ({ packgym }) => {
  const imageUrl = packgym.TenGoiTap.includes("classic")
    ? "https://i.imgur.com/JyCT4PR.png"
    : "https://i.imgur.com/XO0ARYV.png";

  return (
    <View style={styles.itemContainer} px={2} py={5} my={2}>
      <HStack justifyContent="space-between" alignItems="center">
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          alt={packgym.TenGoiTap}
        />
        <Box flex={1} ml={3}>
          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <Text style={styles.name}>{packgym.TenGoiTap}</Text>
            <Button variant={'link'}>Xem chi tiết</Button>
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
              }).format(packgym.Gia)} - ${packgym.ThoiHan} ngày`}
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
      >
        Đăng ký ngay
      </Button>
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
    color: "#3c763d", // Màu chữ cần được đặt ở đây
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
