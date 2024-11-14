
import HomeEmployee from "@/components/Admin/Home/HomeEmployee";
import ManagerLayout from "@/layouts/ManagerLayout/ManageLayout";
import React from "react";

export default function Employee() {
  return (
    <ManagerLayout>
      <HomeEmployee></HomeEmployee>
    </ManagerLayout>
  );
}
