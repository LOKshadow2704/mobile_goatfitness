import moment from "moment";

// Định nghĩa interface cho dữ liệu check-in và đơn hàng
interface Checkin {
  ThoiGian: string;
  CheckOut: number;
}

interface Order {
  IDDonHang: number;
  IDKhachHang: number;
  IDHinhThuc: number;
  NgayDat: string;
  NgayGiaoDuKien: string;
  TrangThaiThanhToan: string;
  DiaChi: string;
  ThanhTien: number;
  TrangThai: string;
}

export interface DashboardData {
  checkin: Checkin[];
  orders: Order[];
}

// Hàm xử lý dữ liệu từ API
export const processDataForCharts = (data: DashboardData) => {
  if (!data || !data.checkin || !data.orders) {
    return { customerStackData: [], orderStackData: [] };  // Trả về giá trị mặc định nếu dữ liệu không hợp lệ
  }

  // Xử lý dữ liệu check-in: phân loại theo ngày và check-out
  const customerCountByDate: { [key: string]: { checkIn: number; checkOut: number } } = {};

  data.checkin.forEach((entry) => {
    const date = moment(entry.ThoiGian).format("DD/MM");

    if (!customerCountByDate[date]) {
      customerCountByDate[date] = { checkIn: 0, checkOut: 0 };
    }

    // Giả sử CheckOut là 1 khi khách đã check-out, 0 khi chưa check-out
    const checkOutValue = entry.CheckOut; // Mỗi khách check-out thì +1

    // Tăng dần số lượng khách check-out hoặc check-in dựa trên giá trị CheckOut
    if (checkOutValue === 1) {
      customerCountByDate[date].checkOut += 1;  // Khách đã check-out
    } else {
      customerCountByDate[date].checkIn += 1;   // Khách chưa check-out
    }
  });

  // Tính tổng số lượng check-in và check-out
  let totalCheckIn = 0;
  let totalCheckOut = 0;
  Object.values(customerCountByDate).forEach(({ checkIn, checkOut }) => {
    totalCheckIn += checkIn;
    totalCheckOut += checkOut;
  });

  // Cách tính bước tăng cho cột Y: xác định giá trị lớn nhất
  const maxCustomerCount = Math.max(totalCheckIn, totalCheckOut);

  // Biểu đồ khách hàng (cột y sẽ là số nguyên và tăng đều)
  const customerStackData = Object.keys(customerCountByDate).map((date) => {
    const { checkIn, checkOut } = customerCountByDate[date];
    return {
      label: date,
      stacks: [
        { value: Math.floor(checkOut), color: "#FF6384" }, // Khách đã check-out (màu đỏ)
        { value: Math.floor(checkIn), color: "#4ABFF4", marginBottom: 2 }, // Khách chưa check-out (màu xanh)
      ],
    };
  });

  // Xử lý dữ liệu đơn hàng: phân loại theo ngày và trạng thái xử lý đơn hàng
  const orderCountByDate: { [key: string]: { processed: number; unprocessed: number } } = {};

  data.orders.forEach((order) => {
    const date = moment(order.NgayDat).format("DD/MM");

    if (!orderCountByDate[date]) {
      orderCountByDate[date] = { processed: 0, unprocessed: 0 };
    }

    // Kiểm tra trạng thái đơn hàng
    if (order.TrangThai === "Chưa xác nhận") {
      orderCountByDate[date].unprocessed += 1; // Đơn hàng chưa xác nhận
    } else {
      orderCountByDate[date].processed += 1; // Đơn hàng đã xác nhận
    }
  });

  // Tính tổng số đơn hàng
  let totalProcessed = 0;
  let totalUnprocessed = 0;
  Object.values(orderCountByDate).forEach(({ processed, unprocessed }) => {
    totalProcessed += processed;
    totalUnprocessed += unprocessed;
  });

  // Biểu đồ đơn hàng
  const orderStackData = Object.keys(orderCountByDate).map((date) => {
    const { processed, unprocessed } = orderCountByDate[date];
    return {
      label: date,
      stacks: [
        { value: Math.floor(unprocessed), color: "#FF6384" }, // Đơn hàng chưa xác nhận (màu đỏ)
        { value: Math.floor(processed), color: "#36A2EB", marginBottom: 2 }, // Đơn hàng đã xác nhận (màu xanh)
      ],
    };
  });

  // Trả về dữ liệu đã xử lý
  return { customerStackData, orderStackData };
};
