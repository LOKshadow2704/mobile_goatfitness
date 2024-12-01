
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import UserManagementScreen from "@/screens/Admin/Users/Users";

export default function Employee() {
  return (
    <AdminLayout>
        <UserManagementScreen />
    </AdminLayout>
  );
}
