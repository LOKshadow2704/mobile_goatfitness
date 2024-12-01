import AdminAppBar from "@/components/Admin/AdminAppBar/AdminAppBar";
import { View } from "native-base";
import React, { ReactNode, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showButton, setShowButton] = useState(false);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 300); 
  };

  return (
    <View style={styles.container} px={2}>
      {children}
      <AdminAppBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  }
});

export default AdminLayout;
