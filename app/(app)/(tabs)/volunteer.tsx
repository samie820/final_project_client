import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { format } from "date-fns";
import axios from "axios";
import { Button, Layout, Card, Text, Input } from "@ui-kitten/components";
import Animated from "react-native-reanimated";
import * as Location from "expo-location";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/components/AuthContext";

export default function VolunteerScreen() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { session, isLoading } = useSession();
  const [location, setLocation] = useState<any>(null);

  const fetchAvailableRequests = async () => {
    try {
      const { latitude, longitude } = location || {};
      console.log("session?.access", session?.access);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/volunteer/requests/?location=${latitude},${longitude}`,
        {
          headers: { Authorization: `Bearer ${session?.access}` },
        }
      );
      setDonations(response.data);
    } catch (error) {
      console.error(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location != null) {
      fetchAvailableRequests();
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

  const onAcceptVolunteerRequest = async (donationId: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/donations/${donationId}/accept-volunteer/`,
        {},
        {
          headers: { Authorization: `Bearer ${session?.access}` },
        }
      );
      Alert.alert(
        "Success",
        "You have successfully accepted this pickup request."
      );
      fetchAvailableRequests();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceLocation();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Animated.Image
        resizeMode="cover"
        src={item.image}
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
      <Text>{item.distance?.toFixed(2)} km away from you</Text>
      <Layout>
        <Text
          style={{
            marginTop: 8,
          }}
        >
          Pickup expires At: {format(new Date(item.expires_at), "PP")}
        </Text>
        <Layout
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          {item.collection_status === "VONTEER_REQUEST_PENDING" ? (
            <>
              <Button
                onPress={() => {
                  // router.push("/(tabs)/(my_requests)/findVolunteers");
                  onAcceptVolunteerRequest(item.id);
                }}
                style={{
                  width: "100%",
                }}
              >
                Accept Request to Pick Up
              </Button>
            </>
          ) : null}

          {item.collection_status === "TO_BE_COLLECTED_BY_VOLUNTEER" ? (
            <>
              <Button
                style={{
                  width: "100%",
                }}
              >
                Contact Recipient
              </Button>
            </>
          ) : null}
        </Layout>
      </Layout>
    </Card>
  );

  if (loading || isLoading) {
    return (
      <View>
        <Text>Loading donations...</Text>
      </View>
    );
  }

  if (!donations.length) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={{ flex: 1 }}>
          <Layout style={styles.layout}>
            <IconSymbol size={48} name="checkmark.circle.fill" color="green" />
            <Text
              style={{
                marginTop: 16,
                textAlign: "center",
              }}
              category="h5"
            >
              No Requests Available
            </Text>
            <Text
              style={{
                marginTop: 8,
                textAlign: "center",
              }}
              category="s1"
            >
              Check back later for new requests.
            </Text>
          </Layout>
        </Layout>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1 }}>
        <Layout
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 16,
          }}
        >
          <IconSymbol size={16} name="location.fill" color="blue" />
          <Text
            style={{
              marginStart: 8,
            }}
            category="s1"
          >
            Volunteer Requests Near You
          </Text>
        </Layout>
        <FlatList
          style={{ backgroundColor: "#f5f5f5", paddingHorizontal: 8 }}
          data={donations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </Layout>
    </SafeAreaView>
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
    minHeight: 350,
  },
  foodType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
