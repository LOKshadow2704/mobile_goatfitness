import React from "react";
import { HStack, Heading, Box } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <HStack justifyContent="space-between" alignItems="center" mb={5}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="exit-to-app" size={20} color="white" />
      </TouchableOpacity>
      <Heading size="lg" color="#333">
        Quản lý người dùng
      </Heading>
      <Box />
    </HStack>
  );
};

const styles = StyleSheet .create({
  backButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});

export default Header;
