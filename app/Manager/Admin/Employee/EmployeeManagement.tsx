import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import EmployeeManagementScreen from "@/screens/Admin/EmployeeManagement/EmployeeManagementScreen";

export default function PersonalTrainer() {
  return (
    <AdminLayout>
        <EmployeeManagementScreen />
    </AdminLayout>
  );
}
