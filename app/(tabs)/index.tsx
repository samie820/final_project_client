import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DonationListScreen() {
  const [donations, setDonations] = useState([
    {
      id: 1,
      food_type: "Bread",
      quantity: 10,
      location: "40.7128,-74.0060",
      image:
        "/media/donation_images/calle-macarone-Vl78eNdiJaQ-unsplash_j5tO6KY.jpg",
      expires_at: "2024-12-01T12:00:00Z",
      distance: 0.0,
    },
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
  ]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.foodType}>{item.food_type}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Distance: {item.distance.toFixed(2)} km</Text>
      <Text>Expires At: {item.expires_at}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={{ paddingTop: insets.top }}>
        <Text>Loading donations...</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top }}>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  foodType: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
