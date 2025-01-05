import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import { Button, Layout, Card, Text, Input } from "@ui-kitten/components";
import Animated from "react-native-reanimated";
import messaging from "@react-native-firebase/messaging";

export default function VolunteerScreen() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<any>(null);
  const [deviceToken, setDeviceToken] = useState<any>(null);

  const fetchMatchedDonations = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      console.log("current device location", location);
      const { coords } = location;
      const { latitude, longitude } = coords || {};
      const response = await axios.get(
        `http://127.0.0.1:8000/api/donations/active?location=${latitude},${longitude}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDonations(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      // Alert.alert("Error", "Failed to fetch matched donations.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceLocation = async () => {
    try {
      // Request permissions

      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("location request status", status);
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
      console.log("Auth status:", authStatus);
      return true;
    }
    return false;
  };

  const getDeviceToken = async () => {
    if (await requestPermissionForPushNotifications()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log("device token: ", token);

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
  }, []);

  useEffect(() => {
    if (location != null) {
      fetchMatchedDonations();
    }
  }, [location]);

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card} status="primary">
      <Animated.Image
        resizeMode="stretch"
        src={`http://127.0.0.1:8000${item.image}`}
        style={{
          width: "100%",
          height: "50%",
        }}
      />
      <Text style={styles.foodType}>{item.food_type}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Distance: {item.distance.toFixed(2)} km</Text>
      <Text>Expires At: {item.expires_at}</Text>
    </Card>
  );

  if (location == null) {
    return (
      <Layout style={styles.container}>
        <View style={{ paddingTop: insets.top }}>
          <Button
            onPress={() => {
              fetchDeviceLocation();
            }}
            appearance="filled"
          >
            Let's get your location
          </Button>
          <Input value={deviceToken} />
        </View>
      </Layout>
    );
  }

  if (loading) {
    return (
      <View style={{ paddingTop: insets.top }}>
        <Text>Loading donations...</Text>
      </View>
    );
  }

  return (
    <Layout style={{ flex: 1 }}>
      <FlatList
        style={{ paddingTop: insets.top, flex: 1 }}
        data={donations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
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
