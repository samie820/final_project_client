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
import { useSession } from "@/components/AuthContext";

export default function PastDonationListScreen() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<any>(null);
  const { session, isLoading } = useSession();

  const fetchMatchedDonations = async () => {
    try {
      const { latitude, longitude } = location || {};
      const response = await axios.get(
        `http://127.0.0.1:8000/api/donations/active?location=${latitude},${longitude}`,
        {
          headers: { Authorization: `Bearer ${session?.access}` },
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

  useEffect(() => {
    if (location != null) {
      fetchMatchedDonations();
    }
  }, [location]);

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
      const { coords } = location;
      const { latitude, longitude } = coords || {};
      setLocation({ latitude, longitude });
    } catch (error) {
      // setErrorMsg("Error fetching location");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeviceLocation();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <Card
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
        <Button
          onPress={() => {
            router.push("/(tabs)/(donate)/createDonation");
          }}
          accessoryLeft={
            <IconSymbol size={16} name="plus.app.fill" color="green" />
          }
          appearance="outline"
          status="primary"
          style={{
            width: "100%",
          }}
        >
          Create new Donation
        </Button>
      </Layout>
      <FlatList
        style={{ backgroundColor: "#f5f5f5", paddingHorizontal: 8 }}
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
