import React from "react";
import {
  Box,
  Heading,
  HStack,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeAdmin() {
  return (
    <View>
      <ScrollView>
        <VStack space={3}>
          <LinearGradient
            colors={["rgba(123, 31, 162, 0.9)", "rgba(123, 31, 162, 0.5)"]}
            style={styles.gradientContainer}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <VStack space={3} p={4}>
              {/* Quản lý Khách hàng */}
              <Heading size={"md"} color="white">
                Khách hàng
              </Heading>
              <HStack justifyContent={"space-between"}>
                <View>
                  <Text style={styles.text}>Đang tập: <Text style={styles.greenNumber}>100</Text></Text>
                </View>
                <View>
                  <Text style={styles.text}>Đang nghỉ: <Text style={styles.redNumber}>100</Text></Text>
                </View>
              </HStack>

              {/* Quản lý Nhân viên */}
              <Heading size={"md"} color="white">
                Nhân viên
              </Heading>
              <HStack justifyContent={"space-between"}>
                <View>
                  <Text style={styles.text}>Đang làm: <Text style={styles.greenNumber}>100</Text></Text>
                </View>
                <View>
                  <Text style={styles.text}>Đang nghỉ: <Text style={styles.redNumber}>100</Text></Text>
                </View>
              </HStack>
            </VStack>
          </LinearGradient>

          {/* Các chức năng quản lý */}
          <Box>
            <VStack>
              <HStack>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Quản lý Gói tập</Text>
                </Pressable>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Quản lý Yêu cầu HLV</Text>
                </Pressable>
              </HStack>
              <HStack>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Quản lý Sản phẩm</Text>
                </Pressable>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Quản lý Đơn hàng</Text>
                </Pressable>
              </HStack>
              <HStack>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Quản lý Người dùng</Text>
                </Pressable>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Quản lý Đơn hàng</Text>
                </Pressable>
              </HStack>
              <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Xem các báo cáo</Text>
                </Pressable>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    width: "100%",
    borderRadius: 15,
    padding: 10,
    marginVertical: 10,
  },
  gradientItem: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  button: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: "rgba(123, 31, 162, 0.3)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 13,
    color: "#6200EA",
  },
  greenNumber: {
    color: "green",
    fontWeight: "bold",
  },
  redNumber: {
    color: "red",
    fontWeight: "bold",
  },
});
