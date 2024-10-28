import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Input,
  ScrollView,
  Text,
  VStack,
  Select,
} from "native-base";
import { StyleSheet, View, RefreshControl } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProductItem from "@/components/ProductItem/ProductItem";
import axios from "axios";
import Constants from 'expo-constants';
import Cart from "@/components/Cart/Cart";

interface Product {
  IDSanPham: number;
  TenSP: string;
  IMG: string;
  DonGia: number;
  Mota: string;
  TenLoaiSanPham: string;
}

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  //Bộ lọc sản phẩm
  const [sortBy, setSortBy] = useState<string>("");
  const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([
    0, 2000000,
  ]);
  const [minInput, setMinInput] = useState(filterPriceRange[0].toString());
  const [maxInput, setMaxInput] = useState(filterPriceRange[1].toString());
  const [isMinFocused, setIsMinFocused] = useState(false);
  const [isMaxFocused, setIsMaxFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ Constants.expoConfig?.extra?.API_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau!" + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
    setRefreshing(false);
  };

  const renderGrid = (items: Product[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      const pair = [items[i], items[i + 1]];
      rows.push(
        <HStack space={2} style={styles.row} key={i}>
          {pair.map((prod, idx) =>
            prod ? (
              <VStack key={prod.IDSanPham} style={styles.col}>
                <ProductItem
                  product={{
                    id: prod.IDSanPham,
                    name: prod.TenSP,
                    image: prod.IMG,
                    price: prod.DonGia,
                  }}
                />
              </VStack>
            ) : (
              <View key={idx} style={styles.col} />
            )
          )}
        </HStack>
      );
    }
    return rows;
  };

  const productCategories = Array.from(
    new Set(products.map((product) => product.TenLoaiSanPham))
  );

  const getFilteredAndSortedProducts = () => {
    let filteredProducts = products;

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.TenSP.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filteredProducts = filteredProducts.filter(
      (product) =>
        product.DonGia >= filterPriceRange[0] &&
        product.DonGia <= filterPriceRange[1]
    );

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.TenLoaiSanPham === selectedCategory
      );
    }

    if (sortBy === "name") {
      filteredProducts = filteredProducts.sort((a, b) =>
        a.TenSP.localeCompare(b.TenSP)
      );
    } else if (sortBy === "priceAsc") {
      filteredProducts = filteredProducts.sort((a, b) => a.DonGia - b.DonGia);
    } else if (sortBy === "priceDesc") {
      filteredProducts = filteredProducts.sort((a, b) => b.DonGia - a.DonGia);
    }

    return filteredProducts;
  };

  return (
    <View style={styles.container}>
      <Cart setShowModal={setShowModal} showModal={showModal} ></Cart>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Box>
          <VStack w="100%" space={5} alignSelf="center">
            <HStack w="100%" justifyContent="space-between" alignItems="center">
              <Heading fontSize="lg">Cửa hàng</Heading>

              <Button onPress={() => setShowModal(true)} variant="ghost">
                <MaterialCommunityIcons
                  name="cart-variant"
                  size={20}
                  style={styles.cart}
                />
              </Button>
            </HStack>
            <Input
              placeholder="Tìm kiếm sản phẩm"
              width="100%"
              borderRadius="4"
              py="2"
              px="1"
              fontSize="12"
              value={searchTerm}
              onChangeText={setSearchTerm}
              InputLeftElement={
                <Icon
                  m="2"
                  ml="3"
                  size="4"
                  color="gray.400"
                  as={<FontAwesome5 name="search" />}
                />
              }
            />
          </VStack>

          {/* Product Categories */}
          {/* Product Categories */}
          <Center mt={5}>
            <VStack space={3}>
              <HStack space="5" alignItems="center" flexWrap="wrap">
                {/* Nút "Tất cả" */}
                <Center size="16">
                  <Button
                    h={16}
                    w="16"
                    px={0}
                    onPress={() => setSelectedCategory(undefined)}
                    backgroundColor={
                      selectedCategory === undefined ? "#3182ce" : undefined
                    }
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      color="#fff"
                      fontSize="xs"
                      numberOfLines={2}
                      textAlign="center"
                    >
                      Tất cả
                    </Text>
                  </Button>
                </Center>
                {productCategories.map((category, index) => (
                  <Center size="16" key={index}>
                    <Button
                      h={16}
                      w="16"
                      px={0}
                      onPress={() => setSelectedCategory(category)}
                      backgroundColor={
                        selectedCategory === category ? "#3182ce" : undefined
                      }
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text
                        color="#fff"
                        fontSize="xs"
                        numberOfLines={2}
                        textAlign="center"
                      >
                        {category}
                      </Text>
                    </Button>
                  </Center>
                ))}
              </HStack>
            </VStack>
          </Center>
        </Box>

        {/* Filter and Sort Options */}
        <Box mt={5}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading fontSize="md">
              Bộ lọc <MaterialCommunityIcons name="filter" size={22} />
            </Heading>
          </HStack>
          <HStack space={3} mt={2}>
            <Select
              minWidth="120"
              placeholder="Sắp xếp theo"
              onValueChange={(value) => setSortBy(value)}
            >
              <Select.Item label="Tên sản phẩm" value="name" />
              <Select.Item label="Giá tăng dần" value="priceAsc" />
              <Select.Item label="Giá giảm dần" value="priceDesc" />
            </Select>
          </HStack>

          {/* Input fields for price range */}
          <VStack mt={5}>
            <Heading size={"xs"} p={1}>
              Lọc theo giá
            </Heading>
            <HStack space={2} justifyContent="space-between">
              <Input
                placeholder="Giá min"
                keyboardType="numeric"
                value={
                  isMinFocused ? minInput : formatCurrency(Number(minInput))
                }
                onFocus={() => setIsMinFocused(true)}
                onBlur={() => {
                  setIsMinFocused(false);
                  const minPrice = parseInt(minInput, 10);
                  setMinInput(!isNaN(minPrice) ? minPrice.toString() : "0");
                  setFilterPriceRange([
                    !isNaN(minPrice) ? minPrice : 0,
                    filterPriceRange[1],
                  ]);
                }}
                onChangeText={(value: string) => {
                  const cleanedValue = value.replace(/[^\d]/g, "");
                  setMinInput(cleanedValue);
                }}
                width="48%"
              />
              <Input
                placeholder="Giá max"
                keyboardType="numeric"
                value={
                  isMaxFocused ? maxInput : formatCurrency(Number(maxInput))
                }
                onFocus={() => setIsMaxFocused(true)}
                onBlur={() => {
                  setIsMaxFocused(false);
                  const maxPrice = parseInt(maxInput, 10);
                  setMaxInput(!isNaN(maxPrice) ? maxPrice.toString() : "0");
                  setFilterPriceRange([
                    filterPriceRange[0],
                    !isNaN(maxPrice) ? maxPrice : 2000000,
                  ]);
                }}
                onChangeText={(value: string) => {
                  const cleanedValue = value.replace(/[^\d]/g, "");
                  setMaxInput(cleanedValue);
                }}
                width="48%"
              />
            </HStack>
          </VStack>
        </Box>
        {/* Product Grid */}
        <Box>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading fontSize="md" mb={5} pt={5}>
              Sản phẩm
            </Heading>
          </HStack>
          {loading ? (
            <Center mt={5}>
              <Text>Đang tải sản phẩm...</Text>
            </Center>
          ) : error ? (
            <Center mt={5}>
              <Text>{error}</Text>
            </Center>
          ) : (
            <ScrollView mt={5}>
              {renderGrid(getFilteredAndSortedProducts())}
            </ScrollView>
          )}
        </Box>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  row: {
    marginBottom: 10,
  },
  col: {
    flex: 1,
  },
  cart: {
    marginRight: 10,
  },
});

export default ProductsScreen;
