import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ProductDetailScreen from "@/screens/ProductDetail/ProductDetail";
import Personal_TrainerDetailScreen from "@/screens/PersonalTrainerDetail/PersonalTrainerDetail";

const ProductDetail = () => {
  const { id } = useLocalSearchParams();

  const Personal_TrainerID = Array.isArray(id) ? id[0] : id;

  return (
    <Personal_TrainerDetailScreen id={Personal_TrainerID} />
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

export default ProductDetail;
