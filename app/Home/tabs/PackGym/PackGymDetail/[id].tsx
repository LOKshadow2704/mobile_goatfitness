import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PackGymDetailScreen from "@/screens/PackGymDetail/PackGymDetail";

const PackGymDetail = () => {
  const { id } = useLocalSearchParams();

  const productId = Array.isArray(id) ? id[0] : id;

  return (
    <PackGymDetailScreen id={productId} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default PackGymDetail;
