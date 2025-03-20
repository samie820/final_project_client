import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Button, Layout, Card, Text, Input } from "@ui-kitten/components";
import Animated from "react-native-reanimated";
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
    status: "PENDING_COLLECTION",
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
    status: "TO_BE_COLLECTED",
  },
];

export default function ReservedDonationScreen() {
  const [donations, setDonations] = useState(mockedDonations);
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
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
      <Text>{item.distance.toFixed(2)} km away from you</Text>
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
          {item.status === "PENDING_COLLECTION" ? (
            <>
              <Button>Pickup Myself</Button>
              <Button
                onPress={() => {
                  router.push("/(tabs)/(my_requests)/findVolunteers");
                }}
              >
                Request Volunteer
              </Button>
            </>
          ) : null}

          {item.status === "TO_BE_COLLECTED" ? (
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
                Track Order
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
