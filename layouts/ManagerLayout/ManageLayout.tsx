import AdminAppBar from "@/components/Admin/AppBar/AppBar";
import { View } from "native-base";
import React, { ReactNode, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface ManagerLayoutProps {
  children: ReactNode; // Chỉ định kiểu cho children
}

const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showButton, setShowButton] = useState(false);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 300); // Hiển thị nút khi cuộn xuống hơn 300 điểm
  };

  return (
    <View style={styles.container} px={2}>
      {children}
      <AdminAppBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  }
});

export default ManagerLayout;
