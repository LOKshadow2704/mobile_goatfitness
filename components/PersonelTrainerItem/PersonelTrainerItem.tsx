import {
  Button,
  Heading,
  HStack,
  Image,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { StyleSheet } from "react-native";

interface PT {
  IDHLV: number,
  HoTen: string,
  DiaChi: string,
  Email: string,
  SDT: string,
  avt: string,
  DichVu: string,
  GiaThue: number,
  IDKhachHang: number,
  ChungChi: string
}

interface PersonalTrainer {
  pt: PT;
}

const PersonelTrainerItem: React.FC<PersonalTrainer> = ({ pt }) => {
  return (
    <View mx={5} style={styles.item} justifyContent={"center"}>
      <HStack space={2}>
        <Image source={{ uri: pt.avt }} alt="" style={styles.image} />
        <VStack justifyContent={"center"} flex={1}>
          <Heading size={"sm"}>{pt.HoTen}</Heading>
          <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">
            {pt.ChungChi} 
          </Text>
          <Text>Loại hình: {pt.DichVu}</Text>
          <Text>Giá thuê {pt.GiaThue} / giờ</Text>
        </VStack>
        <Button>{'>'}</Button>
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: "#155e75", // Màu đường viền
    backgroundColor: "#fff", // Màu nền
    padding: 10, // Thêm padding để item không bị dính vào viền
    margin: 5, // Thêm margin để tạo khoảng cách giữa các item
    borderRadius: 10,
    width: "90%",
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
    width: "100%",
  },
  button: {
    justifyContent: "center",
    width: "100%",
  },
  desc: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
});

export default PersonelTrainerItem;
