import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Select } from "native-base";
import { updateProduct, getCategories } from "../api";

interface UpdateProductModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: any;
  onSuccess: () => void;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  isVisible,
  onClose,
  product,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (err: any) {
        console.log("Không thể tải danh mục");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setProductName(product.TenSP || "");
      setProductPrice(
        product.DonGia !== undefined && product.DonGia !== null
          ? product.DonGia.toString()
          : ""
      );
      setProductQuantity(
        product.SoLuong !== undefined && product.SoLuong !== null
          ? product.SoLuong.toString()
          : ""
      );
      setSelectedCategory(product.IDLoaiSanPham || 0);
    }
  }, [product]);

  const handleUpdate = async () => {
    if (
      !productName ||
      !productPrice ||
      !productQuantity ||
      !selectedCategory ||
      (productName === product.TenSP &&
        productPrice === product.DonGia.toString() &&
        productQuantity === product.SoLuong.toString() &&
        selectedCategory === product.IDLoaiSanPham)
    ) {
      Alert.alert(
        "Cảnh báo",
        "Vui lòng thay đổi thông tin và đảm bảo tất cả các trường không để trống."
      );
      return;
    }

    setLoading(true);

    Alert.alert(
      "Xác nhận cập nhật",
      "Bạn có chắc chắn muốn cập nhật sản phẩm này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Cập nhật",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedData: any = {};

              if (productName && productName !== product.TenSP) {
                updatedData.TenSP = productName;
              }

              const price = parseFloat(productPrice);
              if (!isNaN(price) && price !== product.DonGia) {
                updatedData.DonGia = price;
              } else if (isNaN(price)) {
                Alert.alert("Lỗi", "Giá sản phẩm không hợp lệ.");
                return;
              }

              const quantity = parseInt(productQuantity, 10);
              if (!isNaN(quantity) && quantity !== product.SoLuong) {
                updatedData.SoLuong = quantity;
              } else if (isNaN(quantity)) {
                Alert.alert("Lỗi", "Số lượng sản phẩm không hợp lệ.");
                return;
              }

              if (selectedCategory !== product.IDLoaiSanPham) {
                updatedData.IDLoaiSanPham = selectedCategory;
              }

              if (Object.keys(updatedData).length === 0) {
                Alert.alert("Không có thay đổi", "Không có dữ liệu thay đổi.");
                return;
              }

              const updatedProduct: any = await updateProduct(
                product.IDSanPham,
                updatedData
              );

              if (updatedProduct) {
                onSuccess();
                onClose();
              } else {
                console.log(updatedProduct.success);
                Alert.alert(
                  "Lỗi",
                  "Không thể cập nhật sản phẩm. Vui lòng thử lại.1"
                );
              }
            } catch (error) {
              console.log("Lỗi trong quá trình cập nhật:", error);
              Alert.alert(
                "Lỗi",
                "Không thể cập nhật sản phẩm. Vui lòng thử lại."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Cập nhật sản phẩm</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên sản phẩm</Text>
            <TextInput
              style={styles.input}
              value={productName}
              onChangeText={setProductName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giá sản phẩm</Text>
            <TextInput
              style={styles.input}
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số lượng sản phẩm</Text>
            <TextInput
              style={styles.input}
              value={productQuantity}
              onChangeText={setProductQuantity}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Danh mục sản phẩm</Text>
            <Select
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              placeholder="Chọn một danh mục"
            >
              {categories.map((category) => (
                <Select.Item
                  key={category.IDLoaiSanPham}
                  label={category.TenLoaiSanPham}
                  value={category.IDLoaiSanPham}
                />
              ))}
            </Select>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 300,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default UpdateProductModal;
