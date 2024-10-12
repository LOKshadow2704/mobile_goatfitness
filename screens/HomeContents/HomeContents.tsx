import React from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Text,
  View,
  VStack,
} from "native-base";
import { SCREEN_WIDTH } from "@/assets/diminsons/diminsons";
import { Image, ScrollView, StyleSheet } from "react-native";
import ProductItem from "@/components/ProductItem/ProductItem";



interface Product {
  id: string;
  name: string;
  image: string;
  price: number
}

const HomeContentsScreen = () => {

  const products = [
    { id: "1", name: "Găng tay Aolike Gloves Pro Wrist Wrap", price: 20000, image: "https://i.imgur.com/vICs0bu.png" },
    { id: "2", name: "Găng tay Aolike Gloves Pro Wrist Wrap", price: 20000, image: "https://i.imgur.com/vICs0bu.png" },
    { id: "3", name: "Găng tay Aolike Gloves Pro Wrist Wrap", price: 20000, image: "https://i.imgur.com/vICs0bu.png" },
    { id: "4", name: "Găng tay Aolike Gloves Pro Wrist Wrap", price: 20000, image: "https://i.imgur.com/vICs0bu.png" },
    { id: "5", name: "Găng tay Aolike Gloves Pro Wrist Wrap", price: 20000, image: "https://i.imgur.com/vICs0bu.png" },
    { id: "6", name: "Găng tay Aolike Gloves Pro Wrist Wrap", price: 20000, image: "https://i.imgur.com/vICs0bu.png" },
    { id: "7", name: "Găng tay Aolike Gloves Pro Wrist Wrap", price: 20000, image: "https://i.imgur.com/vICs0bu.png" },
    { id: "8", name: "Găng tay Aolike Gloves Pro Wrist Wrap", price: 20000, image: "https://i.imgur.com/vICs0bu.png" },
  ];
  const renderGrid = (items: Product[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      const pair = [items[i], items[i + 1]];
      rows.push(
        <HStack space={2} style={styles.row} key={i}>
          {pair.map((prod, idx) =>
            prod ? (
              <VStack key={prod.id} style={styles.col}>
                <ProductItem product={prod} />
              </VStack>
            ) : (
              <View key={idx} style={styles.col} /> // Placeholder cho cột trống nếu cần
            )
          )}
        </HStack>
      );
    }
    return rows;
  };
  return (
    <ScrollView   showsVerticalScrollIndicator={false}>
      <Box flex={1} style={styles.container}>
        {/* Container 1 */}
        <Box style={styles.container_item}>
          <HStack space={8}>
            <Center>
              <VStack space={5} pl={5}>
                <Text color="#fff">
                  Luyện tập thôi{" "}
                  <FontAwesome6 name="fire" size={20} color="red" />
                </Text>
                <Button
                  w="120"
                  rightIcon={<FontAwesome6 name="right-long" size={20} />}
                >
                  Check in
                </Button>
              </VStack>
            </Center>
            <Image
              source={require("../../assets/images/box_1_home.png")}
              style={styles.container_item_image}
            />
          </HStack>
        </Box>

        {/* Container 2 */}
        <Box h={100} w="90%" mt={5}>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            space={5}
          >
            <Heading size="sm">Danh mục sản phẩm</Heading>
            <Button size="sm" variant="link" colorScheme="primary">
              Xem thêm
            </Button>
          </HStack>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            marginTop={2}
          >
            <HStack space="3" alignItems="center">
              <Center size="16">
                <Button w="100%" px={0}>
                  {/* Logo */}
                  <VStack alignItems="center">
                    <MaterialIcons
                      name="self-improvement"
                      size={24}
                      color="#fff"
                    />
                    {/* Categories */}
                    <Text color="#fff" fontSize="xs">
                      Whey
                    </Text>
                  </VStack>
                </Button>
              </Center>

              <Center size="16">
                <Button w="100%" px={0}>
                  {/* Logo */}
                  <VStack alignItems="center">
                    <MaterialCommunityIcons
                      name="boxing-glove"
                      size={24}
                      color="#fff"
                    />
                    {/* Categories */}
                    <Text color="#fff" fontSize="xs">
                      Găng tay
                    </Text>
                  </VStack>
                </Button>
              </Center>

              <Center size="16">
                <Button w="100%" px={0}>
                  {/* Logo */}
                  <VStack alignItems="center">
                    <FontAwesome6 name="bandage" size={24} color="#fff" />
                    {/* Categories */}
                    <Text color="#fff" fontSize="xs">
                      Thắt lưng
                    </Text>
                  </VStack>
                </Button>
              </Center>

              <Center size="16">
                <Button w="100%" px={0}>
                  {/* Logo */}
                  <VStack alignItems="center">
                    <FontAwesome6 name="jar" size={24} color="#fff" />
                    {/* Categories */}
                    <Text color="#fff" fontSize="xs">
                      Bình lắc
                    </Text>
                  </VStack>
                </Button>
              </Center>

              <Center size="16">
                <Button w="100%" px={0}>
                  {/* Logo */}
                  <VStack alignItems="center">
                    <Ionicons name="shirt-sharp" size={24} color="#fff" />
                    {/* Categories */}
                    <Text color="#fff" fontSize="xs">
                      Quần áo
                    </Text>
                  </VStack>
                </Button>
              </Center>
            </HStack>
          </ScrollView>
        </Box>
        {/* Container 3 */}
        <Divider
          my="2"
          _light={{
            bg: "muted.400",
            opacity: 0.5,
          }}
          _dark={{
            bg: "muted.300",
            opacity: 0.5,
          }}
          width="90%"
        />
        <Box style={styles.container_item_3}>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            space={5}
            mb={5}
          >
            <Heading size="xs">TOP HLV THÁNG</Heading>
            <Button size="sm" variant="link" colorScheme="primary">
              Xem thêm
            </Button>
          </HStack>
          <VStack>
            <Box style={styles.home_personal_item}>
              <HStack space={10}>
                <Avatar
                  source={require("../../assets/images/avatar-trang-4.jpg")}
                  style={styles.avt}
                />
                <Center>
                  <Heading size="xs">Nguyễn Thành Lộc</Heading>
                  <Text>20 Giờ tập</Text>
                </Center>
                <Center>Top 1</Center>
              </HStack>
            </Box>
            <Divider
              my="2"
              _light={{
                bg: "muted.400",
                opacity: 0.5,
              }}
              _dark={{
                bg: "muted.300",
                opacity: 0.5,
              }}
            />
            <Box style={styles.home_personal_item}>
              <HStack space={10}>
                <Avatar
                  source={require("../../assets/images/avatar-trang-4.jpg")}
                  style={styles.avt}
                />
                <Center>
                  <Heading size="xs">Nguyễn Thành Lộc</Heading>
                  <Text>20 Giờ tập</Text>
                </Center>
                <Center>Top 2</Center>
              </HStack>
            </Box>
            <Divider
              my="2"
              _light={{
                bg: "muted.400",
                opacity: 0.5,
              }}
              _dark={{
                bg: "muted.300",
                opacity: 0.5,
              }}
            />
            <Box style={styles.home_personal_item}>
              <HStack space={10}>
                <Avatar
                  source={require("../../assets/images/avatar-trang-4.jpg")}
                  style={styles.avt}
                />
                <Center>
                  <Heading size="xs">Nguyễn Thành Lộc</Heading>
                  <Text>20 Giờ tập</Text>
                </Center>
                <Center>Top 3</Center>
              </HStack>
            </Box>
          </VStack>
        </Box>
        {/* Container 4 */}
        <View style={styles.container_item_4}>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            space={5}
            mb={5}
            pl={2}
          >
            <Heading size="xs">Sản phẩm gợi ý</Heading>
            <Button size="sm" variant="link" colorScheme="primary" >
              Xem thêm
            </Button>
          </HStack>
          {renderGrid(products)}
        </View>
      </Box>
    </ScrollView>
  );
};

export default HomeContentsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  container_item: {
    marginTop: 20,
    height: 150,
    width: "90%",
    backgroundColor: "#27272a",
    borderRadius: 20,
    padding: 20,
  },
  container_item_image: {
    height: 100,
    width: 100,
  },
  text: {
    color: "black",
  },
  container_item_3: {
    height: 250,
    padding: 20,
  },
  container_item_4: {
    width: "90%",
    marginTop: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avt: {
    height: 50,
    width: 50,
  },
  home_personal_item: {
    paddingVertical: 5,
  },
  product_item: {
    height: 200,
    backgroundColor: "#d7e9f5ba",
    borderRadius: 10,
  },
  image_Product: {
    height: 150,
    width: 150,
    borderRadius: 10,
  },
  row: {
    marginBottom: 10,
  },
  col: {
    flex: 1,
  },
});
