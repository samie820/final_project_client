import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Button, Layout, Card, Text, Input } from "@ui-kitten/components";
import Animated from "react-native-reanimated";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { useSession } from "@/components/AuthContext";

export default function ReservedDonationScreen() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { session, isLoading } = useSession();

  const fetchReservedDonations = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/donations/my-reserved/`,
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
    fetchReservedDonations();
  }, []);

  const onRequestSelfPickup = async (donationId: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/donations/${donationId}/self-pickup/`,
        {},
        {
          headers: { Authorization: `Bearer ${session?.access}` },
        }
      );
      Alert.alert("Success", "You have successfully requested self pickup.");
      fetchReservedDonations();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRequestVolunteer = async (donationId: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/donations/${donationId}/request-volunteer/`,
        {},
        {
          headers: { Authorization: `Bearer ${session?.access}` },
        }
      );
      Alert.alert("Success", "You have successfully requested for a volunteer.");
      fetchReservedDonations();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      <Text>{item?.distance?.toFixed(2) ?? 0} km away from you</Text>
      <Layout>
        <Text
          style={{
            marginTop: 8,
          }}
        >
          Pickup expires At: {item.expires_at}
        </Text>
        <Layout
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          {item.collection_status === "PENDING_COLLECTION" ? (
            <>
              <Button onPress={() => {
                onRequestSelfPickup(item.id);
              }}>Pickup Myself</Button>
              <Button
                onPress={() => {
                  onRequestVolunteer(item.id);
                  // router.push("/(tabs)/(my_requests)/findVolunteers");
                }}
              >
                Request Volunteer
              </Button>
            </>
          ) : null}

          {item.collection_status === "RECIPIENT_SELF_PICKUP" ||
          item.collection_status === "RECIPIENT_RESERVATION" ? (
            <>
              <Button
                status="success"
                accessoryLeft={
                  <IconSymbol size={28} name="paperplane" color="green" />
                }
                style={{
                  width: "100%",
                }}
              >
                You're Collecting it
              </Button>
            </>
          ) : null}

          {item.collection_status === "VONTEER_REQUEST_PENDING" ? (
            <>
              <Button
                status="info"
                style={{
                  width: "100%",
                }}
              >
                Waiting for Volunteer
              </Button>
            </>
          ) : null}

          {item.collection_status === "TO_BE_COLLECTED_BY_VOLUNTEER" ? (
            <>
              <Button
                status="success"
                accessoryLeft={
                  <IconSymbol size={28} name="paperplane" color="green" />
                }
                style={{
                  width: "100%",
                }}
              >
                Track Volunteer
              </Button>
            </>
          ) : null}
        </Layout>
      </Layout>
    </Card>
  );

  if (loading) {
    return (
      <View>
        <Text>Loading donations...</Text>
      </View>
    );
  }

  return (
    <Layout style={{ flex: 1 }}>
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
