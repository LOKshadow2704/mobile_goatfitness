interface User {
  TenDangNhap: string;
  HoTen: string;
  DiaChi: string;
  Email: string;
  SDT: string;
  avt: string;
  IDHoaDon: number | null;
  NgayDangKy: string | null;
  NgayHetHan: string | null;
  TrangThaiThanhToan: string | null;
}


export const processDataForChart = (users: User[]) => {

  let usersWithPaidPackage = 0;
  let usersWithoutPaidPackage = 0;
  let usersWithoutPackage = 0;

  users.forEach((user) => {
    if (user.IDHoaDon) {

      if (user.TrangThaiThanhToan?.toLowerCase() === 'đã thanh toán') {
        usersWithPaidPackage += 1;
      } else if (user.TrangThaiThanhToan?.toLowerCase() === 'chưa thanh toán') {
        usersWithoutPaidPackage += 1;
      }
    } else {
      usersWithoutPackage += 1;
    }
  });


  const totalUsers = usersWithPaidPackage + usersWithoutPaidPackage + usersWithoutPackage;


  const chartData = [
    {
      value: usersWithoutPackage,
      color: '#FF6384',
      label: 'Chưa có gói tập',
      text: `${((usersWithoutPackage / totalUsers) * 100).toFixed(1)}%`
    },
    {
      value: usersWithoutPaidPackage,
      color: '#FF9F40',
      label: 'Chưa thanh toán',
      text: `${((usersWithoutPaidPackage / totalUsers) * 100).toFixed(1)}%`
    },
    {
      value: usersWithPaidPackage,
      color: '#36A2EB',
      label: 'Đã có gói tập',
      text: `${((usersWithPaidPackage / totalUsers) * 100).toFixed(1)}%`
    },
  ];


  return chartData;
};
