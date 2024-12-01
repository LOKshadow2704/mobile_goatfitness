import React from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ProductDetailScreen from "@/screens/Employee/Product/ProductDetail/ProductDetail";
import ManagerLayout from "@/layouts/ManagerLayout/ManageLayout";
ProductDetailScreen;

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);

  return (
    <ManagerLayout>
      <ProductDetailScreen id={productId}></ProductDetailScreen>
    </ManagerLayout>
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
