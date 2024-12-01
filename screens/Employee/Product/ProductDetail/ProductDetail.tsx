import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { deleteProduct } from "../api"; 
import UpdateProductModal from "./UpdateProductModal"; 
import RenderHtml from "react-native-render-html"; 
import { MaterialIcons } from "@expo/vector-icons"; 

interface ProductDetailProps {
  id: number; 
}

const ProductDetailScreen: React.FC<ProductDetailProps> = ({ id }) => {
  const router = useRouter();

  const [product, setProduct] = useState<any>(null); // Dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Lỗi khi tải dữ liệu
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // Hiển thị modal sửa sản phẩm

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${Constants.expoConfig?.extra?.API_URL}/products/info?IDSanPham=${id}`
        );
        if (!response.ok) {
          throw new Error("Không thể lấy thông tin sản phẩm");
        }
        const data = await response.json();
        setProduct(data); // Lưu thông tin sản phẩm
      } catch (err) {
        setError("Không thể lấy dữ liệu sản phẩm");
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };

    fetchProductDetails();
  }, [id, isUpdateModalVisible]);

  // Xử lý khi đang tải dữ liệu
  if (loading) {
    return (
      <View >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Xử lý khi có lỗi
  if (error) {
    return (
      <View >
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  // Xử lý khi không có dữ liệu sản phẩm
  if (!product) {
    return (
      <View >
        <Text style={styles.error}>Sản phẩm không tồn tại.</Text>
      </View>
    );
  }

  // Hàm xử lý xóa sản phẩm
  const handleDeleteProduct = async () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa sản phẩm này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await deleteProduct(id); // Gọi API xóa sản phẩm
            console.log(response);
            Alert.alert("Thành công", "Sản phẩm đã được xóa.");
            router.back(); // Quay lại danh sách sản phẩm
          } catch (err) {
            Alert.alert("Lỗi", "Không thể xóa sản phẩm. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  // Hàm xử lý khi sửa sản phẩm thành công
  const handleUpdateSuccess = () => {
    setIsUpdateModalVisible(false);
    Alert.alert("Thành công", "Cập nhật sản phẩm thành công!");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Tiêu đề và nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()} // Quay lại trang trước
          style={styles.backButton}
        >
          <MaterialIcons name="exit-to-app" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Chi Tiết Sản Phẩm</Text>
      </View>

      {/* Hiển thị hình ảnh sản phẩm */}
      <Image source={{ uri: product.IMG }} style={styles.productImage} />

      {/* Hiển thị thông tin chi tiết sản phẩm */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.TenSP}</Text>
        <Text style={styles.productCategory}>
          Loại sản phẩm: {product.TenLoaiSanPham}
        </Text>
        <Text style={styles.productPrice}>
          {product.DonGia.toLocaleString()} VND
        </Text>
        <Text style={styles.productQuantity}>Kho còn: {product.SoLuong}</Text>

        {/* Hiển thị mô tả sản phẩm dưới dạng HTML */}
        <View style={styles.productDescription}>
          <RenderHtml
            contentWidth={300}
            source={{ html: product.Mota || "Không có mô tả" }}
          />
        </View>
      </View>

      {/* Nút sửa và xóa sản phẩm */}
      <View style={styles.buttonContainer}>
        {/* Modal sửa sản phẩm */}
        <UpdateProductModal
          isVisible={isUpdateModalVisible}
          onClose={() => setIsUpdateModalVisible(false)}
          product={product}
          onSuccess={handleUpdateSuccess}
        />

        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={() => setIsUpdateModalVisible(true)}
        >
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteProduct}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Định nghĩa style cho giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
    marginBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  productInfo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  productQuantity: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
});

export default ProductDetailScreen;
