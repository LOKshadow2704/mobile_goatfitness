import React, { useState } from "react";
import { Button, Icon, Input, Stack, Text, TextArea } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Pressable } from "react-native";

interface MyFormProps{
  setScreen: (screen: string) => void;
}

const MyForm: React.FC <MyFormProps> = ({setScreen}) => {
  const [show, setShow] = useState(false);

  return (
    <Stack space={4} w="100%" alignItems="center" mb="30px">
      {/* Tên đăng nhập */}
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
      />
      {/* Họ và tên */}
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
        placeholder="Họ và tên"
      />
      {/* Email */}
      <Input
        w={{
          base: "75%",
          md: "25%",
        }}
        fontSize="md"
        _input={{ color: "black" }}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="email" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        }
        placeholder="Email"
      />
      {/* Số điện thoại */}
      <Input
        w={{
          base: "75%",
          md: "25%",
        }}
        fontSize="md"
        _input={{ color: "black" }}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="smartphone" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        }
        placeholder="Số điện thoại"
      />
      {/* Địa chỉ */}
      <TextArea
          placeholder="Địa chỉ"
          w="75%"
          maxW="300px"
          autoCompleteType="off"
          fontSize="md"
        _input={{ color: "black" }}
        />
      {/* Mật khẩu */}
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
      />
      <Button onPress={() => console.log("Đăng nhập")}>Đăng ký</Button>
      <Text fontSize="md" color="black">
        Bạn đã có tài khoản?
      </Text>
      <Pressable onPress={() => setScreen('login')}>
        <Text fontSize="md" color="#0e7490">
          Đăng Nhập
        </Text>
      </Pressable>
    </Stack >
  );
};

export default MyForm;
