import { Text } from "native-base";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

interface BackToTopProps {
  scrollViewRef: React.RefObject<ScrollView>;
  showButton: boolean;
}

const BackToTop: React.FC<BackToTopProps> = ({ scrollViewRef, showButton }) => {
  // Khởi tạo giá trị Animated
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // UseEffect để cập nhật độ mờ
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showButton ? 1 : 0, // Từ từ hiện ra khi showButton là true, ẩn đi khi là false
      duration: 300, // Thời gian hiệu ứng
      useNativeDriver: true,
    }).start();
  }, [showButton]);

  return (
    showButton && (
      <Animated.View
        style={[
          styles.backToTopButton,
          { opacity: fadeAnim }, // Áp dụng giá trị độ mờ
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            scrollViewRef.current?.scrollTo({ y: 0, animated: true })
          }
        >
          <FontAwesome5Icon
            name="angle-up"
            color="white"
            style={styles.backToTopText}
            size={16}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  backToTopButton: {
    position: "absolute",
    bottom: 100,
    right: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: "#000", // Đặt nền cho nút nếu cần
    zIndex: 999999,
  },
  backToTopText: {
    color: "#fff", // Đặt màu chữ cho phù hợp với nền
    fontWeight: "bold",
  },
});

export default BackToTop;
