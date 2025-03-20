import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  Button,
  Layout,
  Card,
  Text,
  Input,
  Avatar,
} from "@ui-kitten/components";
import Animated from "react-native-reanimated";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
const mockedDonations = [
  {
    id: 2,
    name: "John Doe",
    location: "40.7128,-74.0060",
    availabilityHours: 4,
    image:
      "/media/donation_images/calle-macarone-Vl78eNdiJaQ-unsplash_1cYwq8W.jpg",
    distance: 0.0,
  },
  {
    id: 3,
    name: "John Doe",
    location: "40.6948,-74.0060",
    availabilityHours: 4,
    image:
      "/media/donation_images/calle-macarone-Vl78eNdiJaQ-unsplash_GARBdlL.jpg",
    distance: 1.9988673661405774,
  },
];

export default function FindVolunteersScreen() {
  const [donations, setDonations] = useState(mockedDonations);
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.foodType}>{item.name}</Text>
        <Avatar
          size="large"
          shape="round"
          src={`http://127.0.0.1:8000${item.image}`}
        />
      </Layout>

      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconSymbol size={16} name="location.fill" color="green" />
        <Text
          style={{
            marginStart: 8,
          }}
        >
          {item.distance.toFixed(2)} km away from you
        </Text>
      </Layout>

      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <IconSymbol size={16} name="star.square.fill" color="green" />
        <Text
          style={{
            marginStart: 8,
          }}
        >
          4.5 (1000+)
        </Text>
      </Layout>
      <Layout>
        <Text
          style={{
            marginTop: 8,
          }}
        >
          Available for the next {item.availabilityHours} hour(s)
        </Text>
        <Layout
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Button
            status="success"
            accessoryLeft={
              <IconSymbol size={28} name="paperplane" color="green" />
            }
            style={{
              width: "100%",
            }}
          >
            View More
          </Button>
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
