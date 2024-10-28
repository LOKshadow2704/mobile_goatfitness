import { Heading, Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import PackGymItem from "@/components/PackGymItem/PackGymItem";
import axios from "axios";
import Constants from "expo-constants"; 

interface PackGym {
  IDGoiTap: number;
  TenGoiTap: string;
  ThoiHan: number;
  Gia: number;
}

const PackGymScreen = () => {
  const [pack, setPack] = useState<boolean>(false);  // Xác định rõ ràng kiểu dữ liệu
  const [data, setData] = useState<PackGym[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchPackGym = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/gympack`  // Sử dụng đúng Constants.expoConfig
      );
      setData(response.data);

      // Kiểm tra nếu có dữ liệu pack thì setPack(true)
      if (response.data && response.data.length > 0) {
        setPack(true);
      } else {
        setPack(false);
      }
    } catch (err) {
      setError("Không thể tải danh sách Gói tập. Vui lòng thử lại sau!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackGym();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPackGym();
    setRefreshing(false);
  };

  const renderItem = (items: PackGym[]) => {
    return items.map((item) => (
      <PackGymItem packgym={item} key={item.IDGoiTap} />
    ));
  };

  return (
    <View px={5} pt={2}>
      {loading ? (
        <Text>Đang tải dữ liệu...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : pack ? (
        <>
          <Heading fontSize="md">Đăng ký càng lâu, ưu đãi càng lớn</Heading>
          {data ? renderItem(data) : <Text>Không có dữ liệu</Text>}
        </>
      ) : (
        <Text>Không tồn tại gói tập</Text>
      )}
    </View>
  );
};

export default PackGymScreen;
