import BackToTop from "@/components/BackToTop/BackToTop";
import TopBar from "@/components/TopBar/TopBar";
import { View } from "native-base";
import React, { ReactNode, useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

interface DefaultLayoutProps {
  children: ReactNode; // Chỉ định kiểu cho children
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showButton, setShowButton] = useState(false);
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 300); // Hiển thị nút khi cuộn xuống hơn 300 điểm
  };
  return (
    <View style={styles.container} >
      <TopBar />
      <ScrollView ref={scrollViewRef} onScroll={handleScroll} >
        {children}
      </ScrollView>
      <BackToTop scrollViewRef={scrollViewRef} showButton={showButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 70,
    backgroundColor: "#f0f9ff",
  },
});

export default DefaultLayout;
