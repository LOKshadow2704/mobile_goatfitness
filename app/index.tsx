import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import WelcomeScreen from "@/layouts/Welcome/Welcome";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { autoLogin } from "@/redux/actions/authActions";
import * as SecureStore from "expo-secure-store";
export default function App() {
  const router = useRouter();
  const dispatch = useDispatch(); // Khai báo dispatch để gọi action
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.user) {
      handleLogin();
    } else {
      dispatch(autoLogin() as any);
    }
  }, [auth.user]);

  const handleLogin = () => {
    switch (auth.user?.TenVaiTro) {
      case "admin":
        router.push("/Manager/Admin");
        break;
      case "employee":
        router.push("/Manager/Employee");
        break;
      case "user":
        router.push("/Home");
        break;
      default:
        break;
    }
  };

  return <WelcomeScreen onLogin={handleLogin} />;
}
