import {
  Box,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
} from "native-base";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SwiperFlatList from "react-native-swiper-flatlist";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import PersonelTrainerItem from "@/components/PersonelTrainerItem/PersonelTrainerItem";
import axios from "axios";
import { API_URL } from "@env";

const { width: viewportWidth } = Dimensions.get("window");

interface PT {
  IDHLV: number,
  HoTen: string,
  DiaChi: string,
  Email: string,
  SDT: string,
  avt: string,
  DichVu: string,
  GiaThue: number,
  IDKhachHang: number,
  ChungChi: string
}

const renderGrid = (pt: PT[]) => {
  return pt.map((item) => (
    <HStack key={item.IDHLV} space={2} justifyContent="flex-start">
      <PersonelTrainerItem pt={item} key={item.IDHLV} />
    </HStack>
  ));
};

const PersonalTrainerScreen = () => {
  const [pts, setPts] = useState<PT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);
  const slides = [
    {
      id: "1",
      name: "Găng tay Aolike Gloves Pro Wrist Wrap",
      price: 20000,
      image: "https://i.imgur.com/vICs0bu.png",
    },
    {
      id: "2",
      name: "Găng tay Aolike Gloves Pro Wrist Wrap",
      price: 20000,
      image: "https://i.imgur.com/vICs0bu.png",
    },
    {
      id: "3",
      name: "Găng tay Aolike Gloves Pro Wrist Wrap",
      price: 20000,
      image: "https://i.imgur.com/vICs0bu.png",
    },
  ];

  const handleKeyboardDidHide = () => {
    if (isFocused) {
      // Gỡ bỏ focus khỏi Input
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/PT`);
      setPts(response.data);
    } catch (err) {
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardDidHide
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [isFocused]);

  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SwiperFlatList
        autoplay
        autoplayDelay={2}
        autoplayLoop
        data={slides}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        )}
      />
      <Box px={5}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading fontSize="md" mb={5} backgroundColor={"red"} pt={5}>
            Huấn luyện viên
          </Heading>
          <HStack>
            <Text>Bộ lọc </Text>
            <MaterialCommunityIcons name="filter" size={22} />
          </HStack>
        </HStack>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }}>
            <Input
              ref={inputRef}
              placeholder="Tìm kiếm"
              width="100%"
              borderRadius="4"
              py="2"
              px="1"
              fontSize="12"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              InputLeftElement={
                <Icon
                  m="2"
                  ml="3"
                  size="4"
                  color="gray.400"
                  as={<FontAwesome5 name="search" />}
                />
              }
            />
          </View>
        </TouchableWithoutFeedback>
      </Box>
      <Box pt={5}>{renderGrid(pts)}</Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: viewportWidth,
    height: viewportWidth * 0.75,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  paginationStyle: {
    bottom: 10,
  },
  dotStyle: {
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeDotStyle: {
    backgroundColor: "#fff",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default PersonalTrainerScreen;
