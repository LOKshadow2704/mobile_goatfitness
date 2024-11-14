import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout";
import axios from "axios";
import { useRouter } from "expo-router";
import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  View,
  VStack,
  useToast,
} from "native-base";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import RenderHtml from "react-native-render-html";
import Constants from "expo-constants";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PaymentSelect from "@/components/PaymentSelect/PaymentSelect";
import moment from 'moment-timezone';

interface Personal_TrainerDetailScreenProps {
  id: string;
}

interface Personal_Trainer {
  IDHLV: number;
  HoTen: string;
  DiaChi: string;
  Email: string;
  SDT: string;
  avt: string;
  DichVu: string;
  GiaThue: number;
  IDKhachHang: number;
  ChungChi: string;
}

const screenWidth = Dimensions.get("window").width;

const Personal_TrainerDetailScreen: React.FC<Personal_TrainerDetailScreenProps> = ({ id }) => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [Personal_Trainer, setPersonal_Trainer] = useState<Personal_Trainer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [showPaymentSelect, setShowPaymentSelect] = useState(false);

  const fetchPersonal_Trainer = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_URL}/personalTrainer/Info?IDHLV=${id}`
      );
      setPersonal_Trainer(response.data);
    } catch (err) {
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau! " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonal_Trainer();
  }, [id]);

  const handleRegister = () => {
    setStartDatePickerVisibility(true);
  };

  const convertToLocalTime = (date: Date) => {
    // Chuyển thời gian về múi giờ "Asia/Ho_Chi_Minh"
    return moment(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
  };

  const handleConfirmStart = (date: Date) => {
    const selectedHour = date.getHours();
    const now = new Date();

    // Kiểm tra giờ bắt đầu hợp lệ
    if (selectedHour < 8 || selectedHour > 22) {
      toast.show({ description: "Vui lòng chọn giờ từ 8h đến 22h." });

      setTimeout(() => {
        hideStartDatePicker();
        setStartDatePickerVisibility(true);
      }, 1000);
      return;
    }

    if (date < now) {
      toast.show({ description: "Vui lòng chọn giờ không sớm hơn hiện tại." });
      setTimeout(() => {
        hideStartDatePicker();
        setStartDatePickerVisibility(true);
      }, 1000);
      return;
    }

    // Lưu thời gian bắt đầu đã chọn và ẩn picker
    setSelectedStartDate(date);
    setStartDatePickerVisibility(false);
    setEndDatePickerVisibility(true);
  };

  const handleConfirmEnd = (date: Date) => {
    if (!selectedStartDate) return;

    // Tạo ngày giờ kết thúc từ ngày giờ bắt đầu và giờ kết thúc người dùng chọn
    const endDate = new Date(selectedStartDate);
    endDate.setHours(date.getHours());
    endDate.setMinutes(date.getMinutes());

    // Kiểm tra giờ kết thúc hợp lệ (phải sau giờ bắt đầu ít nhất 1 giờ)
    if (endDate <= selectedStartDate) {
      toast.show({ description: "Giờ kết thúc phải sau giờ bắt đầu." });
      return;
    }

    // Lưu thời gian kết thúc và ẩn picker
    setSelectedEndDate(endDate);
    setEndDatePickerVisibility(false);
    setShowPaymentSelect(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const createBody = () => {
    return {
      IDHLV: Personal_Trainer?.IDHLV,
      StartDate: selectedStartDate ? convertToLocalTime(selectedStartDate) : "",
      EndDate: selectedEndDate ? convertToLocalTime(selectedEndDate) : "",
      HinhThucThanhToan: 2,
    };
  };

  return (
    <DefaultLayout>
      <Box style={styles.container} w={screenWidth}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : Personal_Trainer ? (
          <>
            <ImageBackground
              style={styles.ImageBox}
              source={{ uri: Personal_Trainer.avt }}
              resizeMode="center"
            >
              <Button
                leftIcon={
                  <FontAwesomeIcon
                    name="angle-double-left"
                    style={{ color: "#fff" }}
                  />
                }
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                w={20}
                onPress={() => router.back()}
              >
                Quay lại
              </Button>
            </ImageBackground>
            <VStack px={3} space={2}>
              <Heading pt={3} style={{ color: "#ea580c" }}>
                {Personal_Trainer?.GiaThue?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Heading>
              <Heading size={"sm"}>{Personal_Trainer.HoTen}</Heading>
            </VStack>
            {/* Thêm hướng dẫn về cách chọn giờ hợp lệ */}
            <Text style={styles.instructionText}>
              Lưu ý: Bạn chỉ có thể chọn giờ từ 8:00 sáng đến 10:00 tối. 
              Giờ bắt đầu phải không được sớm hơn thời điểm hiện tại và 
              giờ kết thúc phải cách giờ bắt đầu ít nhất 1 giờ.
            </Text>
            <HStack space={2} px={3} py={3}>
              <Button w={"100%"} onPress={handleRegister}>
                Đăng ký ngay
              </Button>
            </HStack>
            <View px={3}>
              <RenderHtml
                source={{ html: Personal_Trainer.ChungChi }}
                contentWidth={width}
              />
            </View>

            {/* DateTimePicker cho giờ bắt đầu */}
            <DateTimePickerModal
              isVisible={isStartDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirmStart}
              onCancel={hideStartDatePicker}
              date={selectedStartDate ? selectedStartDate : new Date()}
              minimumDate={new Date()}
            />

            {/* DateTimePicker cho giờ kết thúc */}
            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode="time"
              onConfirm={handleConfirmEnd}
              onCancel={hideEndDatePicker}
              date={
                selectedEndDate
                  ? selectedEndDate
                  : new Date(
                      (selectedStartDate
                        ? selectedStartDate.getTime()
                        : Date.now()) +
                        60 * 60 * 1000
                    )
              }
              minimumDate={
                selectedStartDate
                  ? new Date(selectedStartDate.getTime() + 30 * 60 * 1000)
                  : new Date()
              }
            />

            {/* Hiển thị modal chọn phương thức thanh toán */}
            {showPaymentSelect && (
              <PaymentSelect
                showPaymentModal={showPaymentSelect}
                setShowPaymentModal={setShowPaymentSelect}
                type="personalTrainer"
                body={createBody()}
              />
            )}
          </>
        ) : (
          <Text>Không có dữ liệu sản phẩm</Text>
        )}
      </Box>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ImageBox: {
    height: 200,
  },
  instructionText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default Personal_TrainerDetailScreen;
