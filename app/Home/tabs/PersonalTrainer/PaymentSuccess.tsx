import { useRouter } from 'expo-router';
import { Image } from 'native-base';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


const SuccessScreen: React.FC = () => {
  const route = useRouter();

  return (
    <View style={styles.container}>
        <Image source={require("@/assets/images/check_mark.png")}
            alt="Logo" style={styles.image} />
      <Text style={styles.title}>Thanh toán thành công!</Text>
      <Text style={styles.description}>
        Cảm ơn bạn đã sử dụng dịch vụ
      </Text>
      <Button
        title="Go to Home"
        onPress={()=>route.push('/Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  image:{
    height: 50,
    width: 50
  }
});

export default SuccessScreen;
