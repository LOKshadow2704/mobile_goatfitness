import AdminAppBar from "@/components/Admin/AppBar/AppBar";
import HomeAdmin from "@/components/Admin/Home/HomeAdmin";
import ManagerLayout from "@/layouts/ManagerLayout/ManageLayout";
import QRScanScreen from "@/screens/QRScan/QRScan";
import { Text, View } from "native-base";
import React from "react";

export default function Admin(){
    return(
        <ManagerLayout>
           <HomeAdmin></HomeAdmin>
        </ManagerLayout>
    )
}