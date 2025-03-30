import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import {
  Button,
  Layout,
  Card,
  Text,
  Input,
  ButtonGroup,
} from "@ui-kitten/components";
import Animated from "react-native-reanimated";
import messaging from "@react-native-firebase/messaging";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocalSearchParams } from "expo-router";
import { useSession } from "@/components/AuthContext";

export default function DonationDetailScreen() {
  const [donationDetail, setDonationDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const item = useLocalSearchParams();
  const { session, isLoading } = useSession();

  const { donationId } = item as { donationId: string };

  const fetchSingleDonations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/donations/${donationId}/`,
        {
          headers: { Authorization: `Bearer ${session?.access}` },
        }
      );
      setLoading(false);
      setDonationDetail(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleDonations();
  }, [donationId]);

  const onReserveDonation = async () => {
    try {
      setLoading(true);
      await axios.post(
        `http://127.0.0.1:8000/api/donations/${donationId}/reserve/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${session?.access}`,
            'Content-Type': "application/json",
          },
        }
      );
      setLoading(false);
      Alert.alert("Success", `You have reserved this donation!`);

      fetchSingleDonations();
    } catch (error) {
      console.error(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  console.log("donationDetail", donationDetail);

  if (loading || isLoading || donationDetail == null) {
    return (
      <View style={{ paddingTop: insets.top }}>
        <Text>Loading donations...</Text>
      </View>
    );
  }

  return (
    <Layout style={{ flex: 1 }}>
      <Layout
        style={{
          margin: 0,
          marginTop: 0,
          flex: 1,
        }}
      >
        <ImageBackground
          style={{
            width: "100%",
            height: 150,
            justifyContent: "flex-end",
          }}
          src={donationDetail.image != null ? donationDetail.image : ""}
        >
          <Layout
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.27)",
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "white",
              }}
            >
              {donationDetail.food_type}
            </Text>
          </Layout>
        </ImageBackground>
        <ScrollView
          style={{
            padding: 16,
            flex: 1,
          }}
        >
          <Layout
            style={{
              paddingBottom: 8,
              marginBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0, 0, 0, 0.15)",
            }}
          >
            <Layout
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Layout
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <IconSymbol size={16} name="bag" color="green" />
                <Text
                  style={{
                    marginStart: 8,
                  }}
                >
                  Mixed Bags
                </Text>
              </Layout>
              <Text category="h6">Free</Text>
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

            <Layout
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <IconSymbol size={16} name="clock" color="green" />
              <Text
                style={{
                  marginStart: 8,
                }}
              >
                Available until tomorrow
              </Text>
            </Layout>
          </Layout>

          <Layout
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0, 0, 0, 0.15)",
            }}
          >
            <IconSymbol size={16} name="location.fill" color="green" />
            <Text
              category="h6"
              style={{
                marginStart: 16,
              }}
            >
              Berwick St, London, UK
            </Text>
          </Layout>

          <Layout
            style={{
              marginTop: 8,
            }}
          >
            <Text category="s1">What you could get</Text>
            <Text
              style={{
                marginVertical: 16,
              }}
            >
              Enjoy a delicious meal donation from this Organization or raw
              ingredients you can use to make a meal
            </Text>
          </Layout>

          <Layout
            style={{
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
              }}
              category="s1"
            >
              WHAT OTHER PEOPLE ARE SAYING
            </Text>
            <Layout
              style={{
                flexDirection: "row",
                marginVertical: 8,
                alignItems: "center",
              }}
            >
              <IconSymbol size={16} name="star.square.fill" color="green" />
              <Text
                style={{
                  marginStart: 8,
                }}
                category="h5"
              >
                4.5 / 5.0
              </Text>
            </Layout>

            <Layout
              style={{
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  marginBottom: 8,
                }}
                category="s2"
              >
                Top 3 Highlights
              </Text>

              <Layout
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                  alignItems: "center",
                }}
              >
                <IconSymbol
                  size={28}
                  name="hands.and.sparkles.fill"
                  color="green"
                />
                <Text
                  style={{
                    marginStart: 8,
                  }}
                  category="s1"
                >
                  Delicious food
                </Text>
              </Layout>
              <Layout
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                  alignItems: "center",
                }}
              >
                <IconSymbol
                  size={28}
                  name="takeoutbag.and.cup.and.straw.fill"
                  color="green"
                />
                <Text
                  style={{
                    marginStart: 8,
                  }}
                  category="s1"
                >
                  Great amount of food
                </Text>
              </Layout>
              <Layout
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                  alignItems: "center",
                }}
              >
                <IconSymbol size={28} name="tree" color="green" />
                <Text
                  style={{
                    marginStart: 8,
                  }}
                  category="s1"
                >
                  Still fresh
                </Text>
              </Layout>
            </Layout>
          </Layout>

          <Layout
            style={{
              marginBottom: 100,
            }}
          >
            <Button
              status="success"
              disabled={donationDetail?.is_reserved_by_me || donationDetail?.is_reserved}
              onPress={() => {
                onReserveDonation();
              }}
              style={{
                marginBottom: 8,
              }}
            >
              {donationDetail?.is_reserved_by_me || donationDetail?.is_reserved ? "Reserved" : "Reserve"}
            </Button>
          </Layout>
        </ScrollView>
      </Layout>
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
