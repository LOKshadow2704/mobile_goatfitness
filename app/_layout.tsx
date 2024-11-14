import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NativeBaseProvider, extendTheme } from "native-base";
import { StatusBar, View, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Stack } from "expo-router";

// Cấu hình chủ đề cho NativeBase
const theme = extendTheme({
  config: {
    initialColorMode: "light",
  },
});

// Cấu hình các route cho ứng dụng của bạn
export default function Layout() {
  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("#f0f9ff");
  }, []);

  // Tính toán chiều cao của status bar
  const statusBarHeight = StatusBar.currentHeight || 20; // Giá trị mặc định cho iOS

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NativeBaseProvider theme={theme}>
          <View style={[styles.container, { paddingTop: statusBarHeight }]}>
            <Stack screenOptions={{ headerShown: false }}>
              {/* Màn hình chào mừng */}
              <Stack.Screen name="index" />
              {/* Các tab của USER */}
              <Stack.Screen name="Home/index" />
              <Stack.Screen name="Home/tabs/HomeContents" />
                {/* Màn hình chi tiết Gói tập */}
              <Stack.Screen name="Home/tabs/PackGym/index" />
              <Stack.Screen name="Home/tabs/PackGym/Payment" />
              {/* Màn hình chi tiết Huấn luyện viên */}
              <Stack.Screen name="Home/tabs/PersonalTrainer/index" />
              <Stack.Screen name="Home/tabs/PersonalTrainer/PersonalTrainerDetail/[id]" />
              <Stack.Screen name="Home/tabs/PersonalTrainer/Payment" />
                {/* Màn hình chi tiết sản phẩm */}
              <Stack.Screen name="Home/tabs/Products/index" />
              <Stack.Screen name="Home/tabs/Products/ProductDetail/[id]" />
              <Stack.Screen name="Home/tabs/Products/Payment" />
              <Stack.Screen name="Home/tabs/Products/PurchaseOrder" />
              <Stack.Screen name="Home/tabs/User" />

              {/* Stack Admin */}
              <Stack.Screen name="Manager/Employee/index" />
              <Stack.Screen name="Manager/Employee/PackageGym/PackageGym" />
              <Stack.Screen name="Manager/Employee/PackageGym/UpdatePrice" />
              <Stack.Screen name="Manager/Employee/QRScan" />
            </Stack>
          </View>
        </NativeBaseProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff", // Thêm màu nền nếu cần
  },
});
