import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Button, Layout, Card, Text, Input } from "@ui-kitten/components";
import Animated from "react-native-reanimated";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { useSession } from "@/components/AuthContext";
import { format } from "date-fns";

export default function AvailableAssignmentScreen() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { session, isLoading } = useSession();

  const fetchMyAssignments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/volunteer/my-assignments/`,
        {
          headers: { Authorization: `Bearer ${session?.access}` },
        }
      );
      setDonations(response.data);
      console.log("assignment ", response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAssignments();
  }, []);

  const onMarkAsPickedUp = async (donationId: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/volunteer/donations/${donationId}/in-transit/`,
        {},
        {
          headers: { Authorization: `Bearer ${session?.access}` },
        }
      );
      Alert.alert(
        "Success",
        "You have successfully marked this donation as in transit."
      );
      fetchMyAssignments();
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
        src={`http://127.0.0.1:8000${item.image}`}
        style={{
          width: "110%",
          height: "40%",
          marginLeft: -16,
          marginRight: 0,
          borderRadius: 16,
          marginBottom: 8,
        }}
      />
      <Text style={styles.foodType}>Donated by: {item?.donor?.username}</Text>
      <Text style={styles.foodType}>Donor Email: {item?.donor?.email}</Text>
      {/* <Text>{item?.distance?.toFixed(2) ?? 0} km away from you</Text> */}
      <Text>Reserved by: {item?.reserved_by?.username ?? 0}</Text>
      <Text>Contact Recipient via: {item?.reserved_by?.email ?? 0}</Text>
      <Layout>
        <Text
          style={{
            marginTop: 8,
          }}
        >
          Donation expires At: {format(new Date(item.expires_at), "PP")}
        </Text>
        <Layout
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          {item.collection_status === "TO_BE_COLLECTED_BY_VOLUNTEER" &&
          item.is_in_transit == false ? (
            <>
              <Button
                status="success"
                accessoryLeft={
                  <IconSymbol size={28} name="paperplane" color="green" />
                }
                style={{
                  width: "100%",
                }}
                onPress={() => {
                  onMarkAsPickedUp(item.id);
                }}
              >
                Mark as Picked Up
              </Button>
            </>
          ) : null}
          {item.is_in_transit == true && (
            <Button
              status="info"
              accessoryLeft={
                <IconSymbol size={28} name="paperplane" color="green" />
              }
              style={{
                width: "100%",
              }}
              onPress={() => {
                Alert.alert(
                  "No action needed",
                  "Donation is already in transit. No action needed."
                );
              }}
            >
              Donation in Transit
            </Button>
          )}
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
