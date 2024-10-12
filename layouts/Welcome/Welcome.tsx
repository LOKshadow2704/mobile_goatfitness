import React, { useEffect, useState } from "react";
import { BackHandler, Image, ToastAndroid } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Center, Text, View } from "native-base";
import styles from "./style";
import Login from "@/components/Login/Login";
import Signup from "@/components/Signup/Signup";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePathname, useRouter } from "expo-router";

interface WelcomeScreenProps {
  onLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin }) => {
  const [screen, setScreen] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const auth = useSelector((state: RootState) => state.auth);
  const [backPressed, setBackPressed] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if ((pathname === "/Home" || pathname === "/Manager") && auth.user) {
        if (backPressed) {
          BackHandler.exitApp();
          return true; 
        } else {
          
          setBackPressed(true);
          ToastAndroid.show("Nhấn lần nữa để thoát ứng dụng", ToastAndroid.SHORT);

          setTimeout(() => {
            setBackPressed(false);
          }, 2000); 
          return true; 
        }
      }
      return false; 
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [backPressed, pathname, auth.user , onLogin]); // Thêm auth.user vào dependencies để đảm bảo đúng logic

  const handleScreenChange = (newScreen: string) => {
    setScreen(newScreen);
  };

  return (
    <View flex="1" justifyContent="center" bg="info.50">
      <Center>
        <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
        {screen === "" ? (
          <>
            <TouchableOpacity style={styles.button} onPress={() => handleScreenChange("login")}>
              <Text style={styles.buttonText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
            <Text fontSize="md" style={{ color: "black" }} p="10px">
              Hoặc
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => handleScreenChange("signup")}>
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
          </>
        ) : screen === "login" ? (
          <Login setScreen={setScreen} onLogin={onLogin} />
        ) : screen === "signup" ? (
          <Signup setScreen={setScreen} />
        ) : null}
      </Center>
    </View>
  );
};

export default WelcomeScreen;
