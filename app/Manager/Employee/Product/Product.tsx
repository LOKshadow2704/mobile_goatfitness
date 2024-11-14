import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Modal, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchProducts, addProduct, updateProduct, deleteProduct, updateStock } from './api';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const ProductManagementScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductCategory, setNewProductCategory] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');
  const [newProductQuantity, setNewProductQuantity] = useState<string>('');

  // Hàm tải danh sách sản phẩm
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error :any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm sản phẩm
  const handleAddProduct = async () => {
    try {
      const product = {
        name: newProductName,
        category: newProductCategory,
        price: parseFloat(newProductPrice),
        quantity: parseInt(newProductQuantity)
      };
      await addProduct(product);
      fetchAllProducts();
      setModalVisible(false);
    } catch (error:any) {
      console.error("Error adding product:", error.message);
    }
  };

  // Hàm cập nhật sản phẩm
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    const updatedProduct = {
      name: newProductName,
      category: newProductCategory,
      price: parseFloat(newProductPrice),
      quantity: parseInt(newProductQuantity)
    };
    try {
      await updateProduct(selectedProduct.id, updatedProduct);
      fetchAllProducts();
      setModalVisible(false);
    } catch (error : any) {
      console.error("Error updating product:", error.message);
    }
  };

  // Hàm xóa sản phẩm
  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      fetchAllProducts();
    } catch (error : any) {
      console.error("Error deleting product:", error.message);
    }
  };

  // Hàm cập nhật số lượng sản phẩm
  const handleUpdateStock = async (productId: number, quantity: number) => {
    try {
      await updateStock(productId, quantity);
      fetchAllProducts();
    } catch (error : any) {
      console.error("Error updating stock:", error.message);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <Text>{item.name} - {item.category}</Text>
                <Text>Price: {item.price} VND</Text>
                <Text>Stock: {item.quantity}</Text>
                <Button title="Edit" onPress={() => {
                  setSelectedProduct(item);
                  setNewProductName(item.name);
                  setNewProductCategory(item.category);
                  setNewProductPrice(item.price.toString());
                  setNewProductQuantity(item.quantity.toString());
                  setModalVisible(true);
                }} />
                <Button title="Delete" onPress={() => handleDeleteProduct(item.id)} />
                <Button title="Update Stock" onPress={() => {
                  const newQuantity = prompt("Enter new stock quantity:", item.quantity.toString());
                  if (newQuantity) handleUpdateStock(item.id, parseInt(newQuantity));
                }} />
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <Button title="Add New Product" onPress={() => setModalVisible(true)} />
          
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  value={newProductName}
                  onChangeText={setNewProductName}
                  placeholder="Product Name"
                  style={styles.input}
                />
                <TextInput
                  value={newProductCategory}
                  onChangeText={setNewProductCategory}
                  placeholder="Category"
                  style={styles.input}
                />
                <TextInput
                  value={newProductPrice}
                  onChangeText={setNewProductPrice}
                  placeholder="Price"
                  keyboardType="numeric"
                  style={styles.input}
                />
                <TextInput
                  value={newProductQuantity}
                  onChangeText={setNewProductQuantity}
                  placeholder="Quantity"
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Button title="Save" onPress={selectedProduct ? handleUpdateProduct : handleAddProduct} />
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  productItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#0077b6',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default ProductManagementScreen;
