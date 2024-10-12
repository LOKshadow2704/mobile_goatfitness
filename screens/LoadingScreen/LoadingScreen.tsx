import React from "react";
import { Spinner, View } from "native-base";
import { StyleSheet } from "react-native";

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Spinner color="indigo.500" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Hoặc màu nền khác tùy thuộc vào thiết kế của bạn
    },
});

export default LoadingScreen;
