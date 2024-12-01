import ManagerLayout from "@/layouts/ManagerLayout/ManageLayout";
import ProductManagementScreen from "@/screens/Employee/Product/Product";

export default function Employee() {
  return (
    <ManagerLayout>
      <ProductManagementScreen></ProductManagementScreen>
    </ManagerLayout>
  );
}
