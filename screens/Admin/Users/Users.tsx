import React, { useState, useEffect } from "react";
import { Box, Button, useToast } from "native-base";
import { useRouter } from "expo-router";
import { getUsers, addUser, deleteUser } from "./api";
import Header from "./Header";
import SearchSort from "./SearchSort";
import UserList from "./UserList";
import AddUserModal from "@/components/AddUserModal/AddUserModal";

const UserManagementScreen: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleToUpdate, setRoleToUpdate] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null); // thêm state cho selectedRole
  const [sortBy, setSortBy] = useState<"name" | "role">("name");
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();
  const router = useRouter();

  // Load users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        toast.show({
          description: "Lỗi khi tải người dùng!",
          duration: 5000,
          placement: "top",
          width: "90%",
          style: {
            maxWidth: "90%",
            marginHorizontal: "5%",
          },
        });
      }
    };
    loadUsers();
  }, []);

  // Handle add user
  const handleAddUser = async (userToAdd: any) => {
    try {
      const response = await addUser(userToAdd);
      if (response && response.status === 200) {
        setIsModalOpen(false);
        const updatedUsers = await getUsers();
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        toast.show({
          description: "Người dùng đã được thêm!",
          placement: "top",
        });
      } else {
        toast.show({
          description: "Thêm người dùng thất bại!",
          placement: "top",
        });
      }
    } catch (error: any) {
      console.error("Lỗi khi thêm người dùng:", error.response?.data || error);
      toast.show({
        description: error.response?.data?.error || "Đã có lỗi xảy ra",
        duration: 5000,
        placement: "top",
        width: "90%",
        style: {
          maxWidth: "90%",
          marginHorizontal: "5%",
        },
      });
    }
  };

  // Search function
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      user.TenDangNhap.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Sort users
  const handleSort = (by: "name" | "role") => {
    setSortBy(by);
    let sortedUsers = [...filteredUsers];
    if (by === "name") {
      sortedUsers.sort((a, b) => a.TenDangNhap.localeCompare(b.TenDangNhap));
    } else {
      sortedUsers.sort((a, b) => a.IDVaiTro - b.IDVaiTro);
    }
    setFilteredUsers(sortedUsers);
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await deleteUser(userId);
      console.log(response.data)
      const updatedUsers = await getUsers();
      if (response.status == 200) {
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        toast.show({ description: "Người dùng đã được xóa!" });
        return;
      }
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      toast.show({ description: "Xóa người dùng thất bại!" });
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      toast.show({
        description: "Lỗi khi tải lại danh sách người dùng!",
        duration: 5000,
        placement: "top",
        width: "90%",
        style: {
          maxWidth: "90%",
          marginHorizontal: "5%",
        },
      });
    }
    setRefreshing(false);
  };

  return (
    <Box p={4} bg="#f0f9ff" flex={1}>
      <Header />
      <SearchSort
        searchTerm={searchTerm}
        setSearchTerm={handleSearch}
        handleSort={handleSort}
      />
      <UserList
        filteredUsers={filteredUsers}
        handleDeleteUser={handleDeleteUser}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddUser={handleAddUser}
      />
      <Button
        onPress={() => setIsModalOpen(true)}
        colorScheme="teal"
        w="full"
        mt={5}
        borderRadius="full"
      >
        Thêm người dùng
      </Button>
      <Box pb={70}></Box>
    </Box>
  );
};

export default UserManagementScreen;
