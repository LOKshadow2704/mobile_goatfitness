import React, { useState } from "react";
import {
  Modal,
  Button,
  FormControl,
  Input,
  Select,
  VStack,
  Text,
} from "native-base";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: any) => void;
};

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAddUser,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role_id: 3,
    epl_description: "",
  });
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAdd = () => {
    if (
      !formData.username ||
      !formData.fullname ||
      !formData.phone ||
      !formData.password ||
      !formData.address ||
      !formData.email
    ) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin!");
      setErrorModalOpen(true);
      return;
    }

    // Kiểm tra mật khẩu hợp lệ
    const validatePassword = (password: string) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,18}$/;
      return passwordRegex.test(password);
    };

    if (!validatePassword(formData.password)) {
      setErrorMessage(
        "Mật khẩu phải từ 8-18 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      setErrorModalOpen(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp!");
      setErrorModalOpen(true);
      return;
    }

    if (formData.role_id === 3) {
      setFormData({ ...formData, epl_description: "" }); 
    }

    onAddUser(formData);
    onClose();
  };

  // Modal hiển thị thông báo lỗi
  const ErrorModal = () => (
    <Modal isOpen={isErrorModalOpen} onClose={() => setErrorModalOpen(false)}>
      <Modal.Content>
        <Modal.Header>{errorMessage === "Người dùng đã được thêm thành công!" ? "Thành công" : "Lỗi"}</Modal.Header>
        <Modal.Body>
          <Text>{errorMessage}</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button colorScheme="teal" onPress={() => setErrorModalOpen(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Thêm người dùng mới</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <FormControl>
                <FormControl.Label>Tên đăng nhập</FormControl.Label>
                <Input
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChangeText={(text) =>
                    setFormData({ ...formData, username: text })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Họ và tên</FormControl.Label>
                <Input
                  placeholder="Nhập họ và tên"
                  value={formData.fullname}
                  onChangeText={(text) =>
                    setFormData({ ...formData, fullname: text })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Địa chỉ</FormControl.Label>
                <Input
                  placeholder="Nhập địa chỉ"
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Số điện thoại</FormControl.Label>
                <Input
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Mật khẩu</FormControl.Label>
                <Input
                  placeholder="Nhập mật khẩu"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Xác nhận mật khẩu</FormControl.Label>
                <Input
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    setFormData({ ...formData, confirmPassword: text })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Vai trò</FormControl.Label>
                <Select
                  selectedValue={formData.role_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role_id: value })
                  }
                  accessibilityLabel="Chọn vai trò"
                  placeholder="Chọn vai trò"
                >
                  <Select.Item label="Người dùng" value={3} />
                  <Select.Item label="Nhân viên" value={2} />
                </Select>
              </FormControl>

              {/* Hiển thị mô tả công việc nếu vai trò là nhân viên */}
              {formData.role_id === 2 && (
                <FormControl>
                  <FormControl.Label>Mô tả công việc</FormControl.Label>
                  <Input
                    placeholder="Nhập mô tả công việc"
                    value={formData.epl_description}
                    onChangeText={(text) =>
                      setFormData({ ...formData, epl_description: text })
                    }
                  />
                </FormControl>
              )}
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={onClose}>
                Hủy
              </Button>
              <Button colorScheme="teal" onPress={handleAdd}>
                Thêm
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Modal thông báo lỗi */}
      <ErrorModal />
    </>
  );
};

export default AddUserModal;
