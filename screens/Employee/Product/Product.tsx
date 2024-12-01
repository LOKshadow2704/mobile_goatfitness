import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { fetchProducts } from "./api";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Box, Select } from "native-base";

// Các interface cho dữ liệu sản phẩm
interface APIProduct {
  DaBan: number;
  Discount: number;
  DonGia: number;
  IDLoaiSanPham: number;
  IDSanPham: number;
  IMG: string;
  Mota: string;
  SoLuong: number;
  TenLoaiSanPham: string;
  TenSP: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  img: string;
  description: string;
}

const ProductManagementScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); // Trạng thái làm mới
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("asc"); // "asc" or "desc"
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  // Hàm tải danh sách sản phẩm
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data: APIProduct[] = await fetchProducts();
      const formattedData = data.map((item) => ({
        id: item.IDSanPham,
        name: item.TenSP,
        category: item.TenLoaiSanPham,
        price: item.DonGia,
        quantity: item.SoLuong,
        img: item.IMG,
        description: item.Mota,
      }));
      setProducts(formattedData);

      // Lấy danh sách các loại sản phẩm duy nhất
      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.TenLoaiSanPham))
      );
      setCategories(["All", ...uniqueCategories]);
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Hàm làm mới dữ liệu
  const onRefresh = async () => {
    setRefreshing(true); // Hiển thị trạng thái làm mới
    await fetchAllProducts();
    setRefreshing(false); // Tắt trạng thái làm mới
  };

  // Hàm lọc sản phẩm theo tên và loại
  const filteredProducts = products
    .filter((product) => {
      const matchesName =
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        searchText === "";
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesName && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.img }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name || "Unknown Product"}</Text>
        <Text style={styles.productPrice}>
          Giá: {item.price.toString()} VND
        </Text>
        <Text style={styles.productQuantity}>
          Kho: {item.quantity.toString()}
        </Text>
      </View>
      <Button title="Chi tiết" onPress={() => goToProductDetail(item.id)} />
    </View>
  );

  // Hàm điều hướng đến trang chi tiết sản phẩm
  const goToProductDetail = (id: number) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(`/Manager/Employee/Product/ProductDetail/${id}`);
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề và nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="exit-to-app" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Quản lý Sản Phẩm</Text>
      </View>

      {/* Tìm kiếm */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm sản phẩm..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Lọc theo loại sản phẩm */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Lọc theo loại:</Text>
        <Select
          selectedValue={selectedCategory}
          minWidth="200"
          accessibilityLabel="Chọn loại sản phẩm"
          placeholder="Chọn loại sản phẩm"
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          {categories.map((category) => (
            <Select.Item key={category} label={category} value={category} />
          ))}
        </Select>
      </View>

      {/* Sắp xếp theo giá */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sắp xếp theo giá:</Text>
        <Select
          selectedValue={sortOrder}
          minWidth="200"
          accessibilityLabel="Chọn mức giá"
          onValueChange={(itemValue) => setSortOrder(itemValue)}
          placeholder="Chọn giá"
        >
          <Select.Item label="Giá: Thấp đến cao" value="asc" />
          <Select.Item label="Giá: Cao đến thấp" value="desc" />
        </Select>
      </View>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } // Thêm Refresh Control
        />
      )}

      <Box h={100}></Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f9ff",
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: 'center'
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
    marginLeft: 15
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#777",
  },
  productQuantity: {
    fontSize: 12,
    color: "#888",
  },
});

export default ProductManagementScreen;
