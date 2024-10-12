import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  logo:{
    width: 200, // Đặt lại độ rộng
    height: 200, // Đặt lại chiều cao
    resizeMode: 'contain', // Có thể thay đổi mode của hình ảnh
  },button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});
export default styles;
