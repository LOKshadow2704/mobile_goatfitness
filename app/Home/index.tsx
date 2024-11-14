import React, { useRef, useState } from "react";
import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import AppBar from "@/components/AppBar/AppBar";
import TopBar from "@/components/TopBar/TopBar";
import HomeContents from "@/screens/HomeContents/HomeContents";
import Products from "@/screens/Products/Products";
import PersonalTrainer from "@/screens/PersonalTrainer/PersonalTrainer";
import BackToTop from "@/components/BackToTop/BackToTop";
import PackGym from "@/screens/PackGym/PackGym";
import User from "@/screens/User/User";
import { Box } from "native-base";

const FirstRoute = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showButton, setShowButton] = useState(false);
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 300);
  };
  return (
    <View style={{ flex: 1 }}>
      <HomeContents />
    </View>
  );
};

const SecondRoute = () => {
  return (
    <View style={{ flex: 1 }}>
      <Products />
    </View>
  );
};

const ThirdRoute = () => {
  return (
    <View style={{ flex: 1 }}>
      <PersonalTrainer />
    </View>
  );
};

const FourthRoute = () => {
  return (
    <View style={{ flex: 1 }}>
      <PackGym />
    </View>
  );
};

const FifthRoute = () => {
  return (
    <View style={{ flex: 1 }}>
      <User />
    </View>
  );
};

const initialLayout = {
  width: Dimensions.get("window").width,
};

const App = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Home" },
    { key: "second", title: "Products" },
    { key: "third", title: "Personal Trainer" },
    { key: "fourth", title: "Package Gym" },
    { key: "fifth", title: "User" },
  ]);

  return (
    <View style={styles.container}>
      <TopBar />
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
          third: ThirdRoute,
          fourth: FourthRoute,
          fifth: FifthRoute,
        })}
        renderTabBar={() => null}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{ marginTop: 70 }}
      />
      <AppBar setRoute={setIndex} route={index} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  scrollView: {
    flex: 1,
  },
});

export default App;
