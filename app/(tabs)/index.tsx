import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import {
  Button,
  Layout,
  Card,
  Text,
  Input,
  Spinner,
} from "@ui-kitten/components";
import Animated from "react-native-reanimated";
import messaging from "@react-native-firebase/messaging";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomeScreen() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<any>(null);
  const [deviceToken, setDeviceToken] = useState<any>(null);

  const fetchDeviceLocation = async () => {
    try {
      // Request permissions

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get the current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });
      setLocation(location);
    } catch (error) {
      // setErrorMsg("Error fetching location");
      console.error(error);
    }
  };

  const requestPermissionForPushNotifications = async () => {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      return true;
    }
    return false;
  };

  const getDeviceToken = async () => {
    if (await requestPermissionForPushNotifications()) {
      messaging()
        .getToken()
        .then((token) => {
          //   Alert.alert(token);
          setDeviceToken(token);
        });
    } else {
      console.log("No device token");
    }

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log("remote message", remoteMessage.notification);
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification opened from background",
        remoteMessage.notification
      );
    });

    messaging().setBackgroundMessageHandler(async (backgroundMessage) => {
      console.log("Message handled in the background", backgroundMessage);
    });

    messaging().onMessage(async (remoteMessage) => {
      Alert.alert("FCM Remote message: ", JSON.stringify(remoteMessage));
    });
  };

  useEffect(() => {
    getDeviceToken();
    fetchDeviceLocation();
  }, []);

  if (loading) {
    return (
      <View style={{ paddingTop: insets.top }}>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          maxHeight: "80%",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <Card
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 16,
          }}
        >
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: '100%'
            }}
          >
            <IconSymbol size={32} name="fork.knife.circle.fill" color="green" />
            <Text category="h4">Total Food Rescued</Text>
          </Layout>
          <Text
            style={{
              textAlign: "center",
            }}
            category="h4"
          >
            100
          </Text>
        </Card>
        <Card
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 16,
          }}
        >
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: '100%'
            }}
          >
            <IconSymbol size={32} name="fork.knife.circle.fill" color="green" />
            <Text category="h4">Total Food Donated</Text>
          </Layout>
          <Text
            style={{
              textAlign: "center",
            }}
            category="h4"
          >
            100
          </Text>
        </Card>
        <Card
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 16,
          }}
        >
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: '100%'
            }}
          >
            <IconSymbol size={32} name="car.circle" color="green" />
            <Text category="h4">Total Food Distributed</Text>
          </Layout>
          <Text
            style={{
              textAlign: "center",
            }}
            category="h4"
          >
            100
          </Text>
        </Card>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 250,
  },
  foodType: {
    fontSize: 18,
    fontWeight: "bold",
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
