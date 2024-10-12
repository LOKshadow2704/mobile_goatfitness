import {
  Box,
  Center,
  Divider,
  HStack,
  Image,
  Menu,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useMemo } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SCREEN_WIDTH } from "../../assets/diminsons/diminsons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const TopBar = () => {
  const triggerProps = useMemo(
    () => ({
      style: styles.pressable,
    }),
    []
  );

  const statusBarHeight = StatusBar.currentHeight || 20;

  return (
    <Box style={styles.WrapBox } px="6">
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        alt="Logo"
      />
      <VStack style={styles.wrapUser}>
        <Center>
        <MaterialIcons name="notifications-on" size={25}/>
        </Center>
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  WrapBox: {
    height: 70,
    width: SCREEN_WIDTH,
    position: "absolute",
    top: 0,
    padding: 0,
    margin: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#f0f9ff",
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  wrapUser: {},
  userIMG: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    borderRadius: 25,
  },
  pressable: {
    marginRight: 20,
  },
});

export default React.memo(TopBar);
