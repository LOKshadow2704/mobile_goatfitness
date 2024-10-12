import { Box, HStack, Image, Link } from "native-base";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import QRScan from "../../../app/Manager/Admin/QRScan";
import { useRouter } from "expo-router";

export default function AdminAppBar() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <HStack space={2} justifyContent={"space-between"} px={5}>
        <Box>
          <Image
            source={require("@/assets/images/logo.png")}
            alt="Logo"
            style={styles.logo}
          />
        </Box>
        <Box>
          <HStack space={3} alignItems="center" h={'100%'} justifyContent="center">
            <Link href="/Manager/Admin/QRScan" w={100}> 
              <Pressable onPress={()=>router.push(`/Manager/Admin/QRScan`)}>
                <FontAwesomeIcon name="qrcode" style={styles.icon} />
              </Pressable>
            </Link>
            <Pressable>
              <FontAwesomeIcon name="list-ul" style={styles.icon} />
            </Pressable>
          </HStack>
        </Box>
      </HStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: "#e0f2fe",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  icon: {
    fontSize: 30,
  },
});
