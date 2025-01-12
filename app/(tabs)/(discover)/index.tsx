import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import { Button, Layout, Card, Text, Input } from "@ui-kitten/components";
import Animated from "react-native-reanimated";
import messaging from "@react-native-firebase/messaging";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";

const mockedDonations = [
  {
    id: 2,
    food_type: "Bread",
    quantity: 10,
    location: "40.7128,-74.0060",
    image:
      "/media/donation_images/calle-macarone-Vl78eNdiJaQ-unsplash_1cYwq8W.jpg",
    expires_at: "2024-12-01T12:00:00Z",
    distance: 0.0,
  },
  {
    id: 3,
    food_type: "Bread",
    quantity: 13,
    location: "40.6948,-74.0060",
    image:
      "/media/donation_images/calle-macarone-Vl78eNdiJaQ-unsplash_GARBdlL.jpg",
    expires_at: "2024-12-01T12:00:00Z",
    distance: 1.9988673661405774,
  },
  {
    id: 4,
    food_type: "Sandwich - Novotel",
    quantity: 13,
    location: "40.7578,-74.0060",
    image:
      "/media/donation_images/calle-macarone-Vl78eNdiJaQ-unsplash_NgGpCUy.jpg",
    expires_at: "2024-12-01T12:00:00Z",
    distance: 4.99719577390573,
  },
  {
    id: 5,
    food_type: "Sandwich - Novotel",
    quantity: 13,
    location: "40.7578,-74.0060",
    image:
      "/media/donation_images/calle-macarone-Vl78eNdiJaQ-unsplash_d161RVJ.jpg",
    expires_at: "2024-12-01T12:00:00Z",
    distance: 4.99719577390573,
  },
  {
    id: 6,
    food_type: "Sandwich - Greenwich",
    quantity: 13,
    location: "40.7578,-74.0060",
    image:
      "/media/donation_images/calle-macarone-Vl78eNdiJaQ-unsplash_lG4tmdC.jpg",
    expires_at: "2024-12-01T12:00:00Z",
    distance: 4.99719577390573,
  },
];

export default function DonationListScreen() {
  const [donations, setDonations] = useState(mockedDonations);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<any>(null);
  const [deviceToken, setDeviceToken] = useState<any>(null);
  const [locationName, setLocationName] = useState("");

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
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationName = async () => {
    try {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      // Get the current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Perform reverse geocoding
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      // Extract location name
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const name = `${address.city || ""}, ${address.region || ""}, ${
          address.country || ""
        }`;
        setLocationName(name);
      } else {
        setLocationName("Unknown location");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (location != null) {
      fetchMatchedDonations();
    }
    fetchLocationName();
  }, [location]);

  const renderItem = ({ item }: { item: any }) => (
    <Card
      onPress={() => {
        router.push("/(tabs)/(discover)/donationDetail");
      }}
      style={styles.card}
      footer={<Text>Expires At: {item.expires_at}</Text>}
    >
      <Animated.Image
        resizeMode="cover"
        src={`http://127.0.0.1:8000${item.image}`}
        style={{
          width: "110%",
          height: "60%",
          marginLeft: -16,
          marginRight: 0,
          borderRadius: 16,
          marginBottom: 8,
        }}
      />
      <Text style={styles.foodType}>{item.food_type}</Text>
      <Text
        style={{
          marginVertical: 8,
        }}
      >
        {item.quantity} item(s) left
      </Text>
      <Text>{item.distance.toFixed(2)} km away from you</Text>
    </Card>
  );

  if (loading) {
    return (
      <View style={{ paddingTop: insets.top }}>
        <Text>Loading donations...</Text>
      </View>
    );
  }

  return (
    <Layout style={{ flex: 1, paddingTop: insets.top }}>
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 8,
        }}
      >
        <IconSymbol size={16} name="location.fill" color="green" />
        <Text>{locationName}</Text>
      </Layout>
      <FlatList
        style={{
          backgroundColor: "#f5f5f5",
          paddingHorizontal: 8,
          paddingTop: 16,
        }}
        data={donations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListFooterComponent={<View style={{ height: 100 }} />}
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
    borderRadius: 24,
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
