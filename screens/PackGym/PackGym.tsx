import { Heading, Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import PackGymItem from "@/components/PackGymItem/PackGymItem";
import axios from "axios";
import { API_URL } from "@env";

interface PackGym {
  IDGoiTap: number;
  TenGoiTap: string;
  ThoiHan: number;
  Gia: number;
}

const PackGymScreen = () => {
  const [pack, setPack] = useState(false);
  const [data, setData] = useState<PackGym[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchPackGym = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/gympack`
      );
      setData(response.data);
    } catch (err) {
      setError("Không thể tải danh sách Gói tập. Vui lòng thử lại sau!");
      console.log(err);
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

  // useEffect(()=>{
  //   // check gói tập
  // },[])
  return pack ? (
    <View px={5} pt={2}>
      <Text fontSize="xs">Tồn tại gói tập</Text>
    </View>
  ) : (
    <View px={5} pt={2}>
      <Heading fontSize="md">Đăng ký càng lâu, ưu đãi càng lớn</Heading>
      {data ? renderItem(data) : <Text>Không có dữ liệu</Text>}
    </View>
  );
};

export default PackGymScreen;
