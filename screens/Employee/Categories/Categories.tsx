import React, { useEffect, useState } from "react";
import { ScrollView, Alert, TextInput, StyleSheet, RefreshControl } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Icon,
  Heading,
  Modal,
  FormControl,
} from "native-base";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./api";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const CategoriesScreen: React.FC = () => {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false); // Trạng thái để kiểm soát refresh
  const [showModal, setShowModal] = useState<boolean>(false); // Trạng thái modal
  const router = useRouter();

  const loadCategories = async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName) {
      Alert.alert("Lỗi", "Tên danh mục không được để trống.");
      return;
    }
    try {
      await addCategory(categoryName);
      setCategoryName("");
      loadCategories();
      Alert.alert("Thành công", "Đã thêm danh mục mới.");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm danh mục.");
    }
  };

  const handleEditCategory = async () => {
    if (!categoryName) {
      Alert.alert("Lỗi", "Tên danh mục không được để trống.");
      return;
    }
    if (editCategoryId !== null) {
      try {
        await updateCategory(editCategoryId, categoryName);
        setIsEditing(false);
        setCategoryName("");
        setShowModal(false); // Đóng modal sau khi sửa thành công
        loadCategories();
        Alert.alert("Thành công", "Cập nhật danh mục thành công.");
      } catch (error) {
        Alert.alert("Lỗi", "Không thể cập nhật danh mục.");
      }
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa danh mục này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(categoryId);
              loadCategories();
              Alert.alert("Thành công", "Danh mục đã được xóa.");
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa danh mục.");
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategories(); // Lại load danh sách danh mục
    setRefreshing(false); // Tắt trạng thái refreshing sau khi hoàn thành
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <VStack space={3}>
        <HStack my={5} alignItems={"center"}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="exit-to-app" size={20} color="white" />
          </TouchableOpacity>
          <Heading textAlign="center" size="lg" ml={4}>
            Danh mục sản phẩm
          </Heading>
        </HStack>
        <HStack space={2}>
          <TextInput
            placeholder="Nhập tên danh mục"
            value={categoryName}
            onChangeText={setCategoryName}
            style={{ flex: 1, borderWidth: 1, padding: 8, borderRadius: 5 }}
          />
          <Button
            onPress={isEditing ? handleEditCategory : handleAddCategory}
            colorScheme="teal"
            leftIcon={
              <Icon
                as={AntDesign}
                name={isEditing ? "edit" : "plus"}
                size={5}
              />
            }
          >
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </HStack>

        {categories.map((category) => (
          <Box
            key={category.IDLoaiSanPham}
            borderWidth={1}
            borderColor="coolGray.200"
            borderRadius="md"
            bg="white"
            p={4}
          >
            <VStack space={2}>
              <HStack justifyContent="space-between">
                <Text fontSize="md" bold>
                  {category.TenLoaiSanPham} {/* Hiển thị TenLoaiSanPham */}
                </Text>
                <HStack space={2}>
                  <Button
                    size="sm"
                    onPress={() => {
                      setIsEditing(true);
                      setEditCategoryId(category.IDLoaiSanPham);
                      setCategoryName(category.TenLoaiSanPham);
                      setShowModal(true); // Mở modal khi bấm sửa
                    }}
                    variant="outline"
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="danger"
                    onPress={() => handleDeleteCategory(category.IDLoaiSanPham)}
                  >
                    Xóa
                  </Button>
                </HStack>
              </HStack>
              <Divider />
            </VStack>
          </Box>
        ))}
      </VStack>
      <Box pb={70}></Box>

      {/* Modal Cập nhật danh mục */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Cập nhật danh mục</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Tên danh mục</FormControl.Label>
              <TextInput
                value={categoryName}
                onChangeText={setCategoryName}
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 5,
                  borderColor: "#ccc",
                }}
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button
              colorScheme="blue"
              onPress={handleEditCategory}
            >
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
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
