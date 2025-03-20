import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Layout, Input } from "@ui-kitten/components";
import { IconSymbol } from "@/components/ui/IconSymbol";
import * as ImagePicker from "expo-image-picker";

export default function CreateDonationScreen() {
  const insets = useSafeAreaInsets();
  const [foodType, setFoodType] = useState("");
  const [quantity, setFoodQuantity] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [expiration, setExpiration] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <Layout style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Input
          placeholder="Enter Food Type"
          value={foodType}
          onChangeText={(nextValue) => setFoodType(nextValue)}
        />
        <Input
          placeholder="Enter Number of Items"
          value={quantity}
          onChangeText={(nextValue) => setFoodQuantity(nextValue)}
        />
        <Input
          placeholder="Enter Location for pickup"
          value={pickupLocation}
          onChangeText={(nextValue) => setPickupLocation(nextValue)}
        />
        <Input
          placeholder="Enter when donation expires"
          value={expiration}
          onChangeText={(nextValue) => setExpiration(nextValue)}
        />
        <Button
          accessoryLeft={
            <IconSymbol size={16} name="plus.app.fill" color="green" />
          }
          onPress={() => {
            pickImage()
          }}
          appearance="outline"
          status="primary"
          style={{
            width: "100%",
          }}
        >
          Select Image
        </Button>
      </Layout>
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 8,
        }}
      >
        <Button
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
