import { Box, Center, HStack, Pressable, Text, VStack } from "native-base";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

interface AppBarProps {
  setRoute: (route: number) => void;
  route: number;
}

const AppBar: React.FC<AppBarProps> = ({ setRoute, route }) => {
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <Center h="100%" mx="1" py="3">
        <HStack justifyContent="center">
          {/* HOME */}
          <Center h="12" w="20%">
            <Pressable
              onPress={() => setRoute(0)}
              w="100%"
              h="100%"
              style={route === 0 ? styles.activeMenu : {}}
            >
              <VStack>
                <Center pt="2">
                  <FontAwesome5
                    style={[styles.Icon, route === 0 ? styles.activeIcon : {}]}
                    name="home"
                    size={25}
                    color={route === 0 ? "#007aff" : "#0c4a6e"}
                  />
                  <Text
                    style={[styles.Text, route === 0 ? styles.activeText : {}]}
                  >
                    Home
                  </Text>
                </Center>
              </VStack>
            </Pressable>
          </Center>
          {/* SHOP */}
          <Center h="12" w="20%">
            <Pressable
              onPress={() => setRoute(1)}
              w="100%"
              h="100%"
              style={route === 1 ? styles.activeMenu : {}}
            >
              <VStack>
                <Center pt="2">
                  <FontAwesome6
                    style={[styles.Icon, route === 1 ? styles.activeIcon : {}]}
                    name="shop"
                    size={25}
                    color={route === 1 ? "#007aff" : "#0c4a6e"}
                  />
                  <Text
                    style={[styles.Text, route === 1 ? styles.activeText : {}]}
                  >
                    Cửa hàng
                  </Text>
                </Center>
              </VStack>
            </Pressable>
          </Center>
          {/* PERSONAL TRAINER */}
          <Center h="12" w="20%">
            <Pressable
              onPress={() => setRoute(2)}
              w="100%"
              h="100%"
              style={route === 2 ? styles.activeMenu : {}}
            >
              <VStack>
                <Center pt="2">
                  <FontAwesome6
                    style={[styles.Icon, route === 2 ? styles.activeIcon : {}]}
                    name="person-circle-plus"
                    size={25}
                    color={route === 2 ? "#007aff" : "#0c4a6e"}
                  />
                  <Text
                    style={[styles.Text, route === 2 ? styles.activeText : {}]}
                  >
                    PT
                  </Text>
                </Center>
              </VStack>
            </Pressable>
          </Center>
          {/* PACKAGE GYM */}
          <Center h="12" w="20%">
            <Pressable
              onPress={() => setRoute(3)}
              w="100%"
              h="100%"
              style={route === 3 ? styles.activeMenu : {}}
            >
              <VStack>
                <Center pt="2">
                  <FontAwesome6
                    style={[styles.Icon, route === 3 ? styles.activeIcon : {}]}
                    name="dumbbell"
                    size={25}
                    color={route === 3 ? "#007aff" : "#0c4a6e"}
                  />
                  <Text
                    style={[styles.Text, route === 3 ? styles.activeText : {}]}
                  >
                    Gói tập
                  </Text>
                </Center>
              </VStack>
            </Pressable>
          </Center>
          {/* USER */}
          <Center h="12" w="20%">
            <Pressable
              onPress={() => setRoute(4)}
              w="100%"
              h="100%"
              style={route === 4 ? styles.activeMenu : {}}
            >
              <VStack>
                <Center pt="2">
                  <FontAwesome6
                    style={[styles.Icon, route === 4 ? styles.activeIcon : {}]}
                    name="user-gear"
                    size={25}
                    color={route === 4 ? "#007aff" : "#0c4a6e"}
                  />
                  <Text
                    style={[styles.Text, route === 4 ? styles.activeText : {}]}
                  >
                    User
                  </Text>
                </Center>
              </VStack>
            </Pressable>
          </Center>
        </HStack>
      </Center>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeAreaView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: "#e0f2fe",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  Text: {
    color: "black",
    fontSize: 10,
  },
  Icon: {
    fontWeight: "bold",
  },
  activeMenu: {
    position: 'absolute',
    top: -20,
    backgroundColor: "#e0f2fe",
    borderRadius: 20
  },
  activeIcon: {
    fontSize: 30
  },
  activeText: {
    color: "#0c4a6e",
    fontWeight: "bold",
    fontSize: 12
  },
});

export default React.memo(AppBar);
