import React, { useEffect, useState } from "react";
import { Button, Icon, Input, Stack, Text } from "native-base";
import { Pressable } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { login } from "@/redux/actions/authActions";
import { useRouter } from "expo-router";

interface MyFormProps {
  setScreen: (screen: string) => void;
  onLogin: () => void;
}

const MyForm: React.FC<MyFormProps> = ({ setScreen, onLogin }) => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(login(username, password));
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    if (auth.user) {
      onLogin(); // Gọi onLogin nếu user đã được cập nhật
    } else if (auth.error) {
      console.log("User not updated after login:" + auth.error);
    }
  }, [auth.user, auth.error]); 

  return (
    <Stack space={4} w="100%" alignItems="center">
      <Input
        w={{
          base: "75%",
          md: "25%",
        }}
        fontSize="md"
        _input={{ color: "black" }}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="person" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        }
        placeholder="Tên đăng nhập"
        onChangeText={setUsername}
      />
      <Input
        w={{
          base: "75%",
          md: "25%",
        }}
        fontSize="md"
        _input={{ color: "black" }}
        type={show ? "text" : "password"}
        InputRightElement={
          <Pressable onPress={() => setShow(!show)}>
            <Icon
              as={
                <MaterialIcons name={show ? "visibility" : "visibility-off"} />
              }
              size={5}
              mr="2"
              color="muted.400"
            />
          </Pressable>
        }
        placeholder="Mật khẩu"
        onChangeText={setPassword}
      />
      <Button onPress={handleLogin}>Đăng nhập</Button>
      <Text fontSize="md" color="black">
        Bạn chưa có tài khoản?
      </Text>
      <Pressable onPress={() => setScreen("signup")}>
        <Text fontSize="md" color="#0e7490">
          Đăng ký
        </Text>
      </Pressable>
    </Stack>
  );
};

export default MyForm;
