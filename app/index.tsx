import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import WelcomeScreen from "@/layouts/Welcome/Welcome";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
export default function App() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    handleLogin();
  }, [auth.user]);
  const handleLogin = () => {
    switch (auth.user?.TenVaiTro) {
      case "admin":
        router.push("/Manager/Admin");
        break;
      case "employee":
        router.push("/Manager/Admin");
        break;
      case "user":
        router.push("/Home");
        break;
      default:
        console.log('none')
        break;
    }
  };
  return <WelcomeScreen onLogin={handleLogin} />;
}
