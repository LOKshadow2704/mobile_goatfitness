
import ManagerLayout from "@/layouts/ManagerLayout/ManageLayout";
import WorkScheduleScreen from "@/screens/Employee/WorkScheduleScreen/WorkScheduleScreen";
import React from "react";

export default function Employee() {
  return (
    <ManagerLayout>
        <WorkScheduleScreen></WorkScheduleScreen>
    </ManagerLayout>
  );
}
