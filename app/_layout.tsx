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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={theme}>
        <Provider store={store}>
          <View style={[styles.container, { paddingTop: statusBarHeight }]}>
            <Stack screenOptions={{ headerShown: false }}>
              {/* Màn hình chào mừng */}
              <Stack.Screen name="index" />
              {/* Các tab của Home */}
              <Stack.Screen name="Home/index" />
              <Stack.Screen name="Home/tabs/HomeContents" />
              <Stack.Screen name="Home/tabs/PackGym" />
              <Stack.Screen name="Home/tabs/PersonalTrainer" />
              <Stack.Screen name="Home/tabs/Products/Products" />
              <Stack.Screen name="Home/tabs/User" />
              {/* Màn hình chi tiết sản phẩm */}
              <Stack.Screen name="Home/tabs/Products/ProductDetail/[id]" />
              {/* Stack Admin */}
              <Stack.Screen name="Manager/Admin/index" />
              <Stack.Screen name="Manager/Admin/QRScan" />
            </Stack>
          </View>
        </Provider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff", // Thêm màu nền nếu cần
  },
});
