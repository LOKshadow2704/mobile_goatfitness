import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ProductDetailScreen from "@/screens/ProductDetail/ProductDetail";

const ProductDetail = () => {
  const { id } = useLocalSearchParams();

  const productId = Array.isArray(id) ? id[0] : id;

  return (
    <ProductDetailScreen id={productId} />
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
