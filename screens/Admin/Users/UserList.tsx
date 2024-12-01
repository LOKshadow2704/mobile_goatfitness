import React from "react";
import { ScrollView, HStack, VStack, Text, Button } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { RefreshControl } from "react-native";

interface UserListProps {
  filteredUsers: any[];
  handleDeleteUser: (userId: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

const UserList: React.FC<UserListProps> = ({
  filteredUsers,
  handleDeleteUser,
  refreshing,
  onRefresh,
}) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {filteredUsers.map((user) => (
        <LinearGradient
          key={user.TenDangNhap}
          colors={
            user.IDVaiTro === 2
              ? ["#4A90E2", "#6DB3F2"]
              : ["#4CAF50", "#81C784"]
          }
          style={{
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <VStack flex={1}>
            <Text color="white" fontSize="lg" fontWeight="bold">
              {user.TenDangNhap}
            </Text>
            <Text color="white" fontSize="sm">
              {user.IDVaiTro === 2 ? "Nhân viên" : "Người dùng"}
            </Text>
          </VStack>

          <HStack space={2}>
            <Button
              size="sm"
              colorScheme="danger"
              onPress={() => handleDeleteUser(user.TenDangNhap)}
            >
              Xóa
            </Button>
          </HStack>
        </LinearGradient>
      ))}
    </ScrollView>
  );
};

export default UserList;
