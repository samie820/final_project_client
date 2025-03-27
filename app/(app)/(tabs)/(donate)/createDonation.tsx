import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Layout, Input, Datepicker, Text, Spinner } from "@ui-kitten/components";
import { IconSymbol } from "@/components/ui/IconSymbol";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useSession } from "@/components/AuthContext";

export default function CreateDonationScreen() {
  const insets = useSafeAreaInsets();
  const { session, isLoading } = useSession();
  console.log("session ======>", session);
  const [foodType, setFoodType] = useState("");
  const [isSubmitting, setSubmitting ] = useState(false);
  const [quantity, setFoodQuantity] = useState("");
  const [pickupLocation, setPickupLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [expiration, setExpiration] = useState(new Date());
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
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

  const handleCreateDonation = async () => {
    try {
      setSubmitting(true);
      // Prepare FormData
      const formData = new FormData();

      formData.append("food_type", foodType);
      formData.append("quantity", quantity);
      formData.append(
        "location",
        pickupLocation
          ? `${pickupLocation.latitude},${pickupLocation.longitude}`
          : ""
      );
      // Make sure the date is converted to a string if needed
      formData.append("expires_at", expiration.toISOString());

      // Append the image to formData if any
      if (image) {
        const filename = image.split("/").pop() || "photo.jpg";
        // Infer the type of the image
        const match = /\.(\w+)$/.exec(filename);
        const mimeType = match ? `image/${match[1]}` : `image`;

        formData.append("image", {
          uri: image,
          name: filename,
          type: mimeType,
        } as any);
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/donations/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session?.access}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorRes = await response.text();
        throw new Error(`Request failed: ${errorRes}`);
      }

      const data = await response.json();
      console.log("Donation created successfully:", data);

      // Clear fields or navigate away as needed
      setFoodType("");
      setFoodQuantity("");
      setPickupLocation(null);
      setExpiration(new Date());
      setImage(null);

      setSubmitting(false);
    } catch (error) {
      console.error("Error creating donation:", error);
      setSubmitting(false);
    }
  };

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
      setPickupLocation({ latitude, longitude });
    } catch (error) {
      // setErrorMsg("Error fetching location");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeviceLocation();
  }, []);


  return (
    <Layout style={{ flex: 1, paddingTop: insets.top }}>
      <Layout
        style={{
          paddingHorizontal: 8,
        }}
      >
        <Input
          label={"Food Type"}
          placeholder="Enter Food Type"
          value={foodType}
          onChangeText={(nextValue) => setFoodType(nextValue)}
          style={{
            marginBottom: 8,
          }}
        />
        <Input
          label={"Quantity"}
          placeholder="Enter Number of Items"
          value={quantity}
          onChangeText={(nextValue) => setFoodQuantity(nextValue)}
          style={{
            marginBottom: 8,
          }}
        />
        <Input
          label={"Pickup Location"}
          placeholder="Your current location will be used"
          value={
            pickupLocation
              ? `${pickupLocation.latitude}, ${pickupLocation.longitude}`
              : ""
          }
          disabled={true}
          style={{
            marginBottom: 8,
          }}
        />
        <Text
          style={{
            marginVertical: 8,
          }}
        >
          Expiration Date
        </Text>
        <Datepicker
          date={expiration}
          onSelect={(nextDate) => setExpiration(nextDate)}
        />
        <Button
          accessoryLeft={
            <IconSymbol size={16} name="plus.app.fill" color="green" />
          }
          onPress={() => {
            pickImage();
          }}
          appearance="outline"
          status="primary"
          style={{
            width: "80%",
            alignSelf: "center",
            marginTop: 16,
          }}
        >
          Select Image
        </Button>
        {/* Show a preview if the user has picked an image */}
        {image && (
          <Layout style={{ marginTop: 16, alignItems: "center" }}>
            <Image
              source={{ uri: image }}
              style={{ width: 150, height: 150, borderRadius: 8 }}
            />
          </Layout>
        )}
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
            isSubmitting && (
              <Spinner size="small" />
            )
          }
          disabled={isSubmitting}
          appearance="outline"
          onPress={handleCreateDonation}
          status="primary"
          style={{
            width: "100%",
            marginTop: 24,
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
