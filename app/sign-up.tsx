import { Link, router } from "expo-router";
import { View } from "react-native";

import { useSession } from "../components/AuthContext";
import {
  Button,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import * as Location from "expo-location";

const data = ["Donor", "Recipient", "Volunteer"];

export default function SignUp() {
  const { signIn } = useSession();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(
    new IndexPath(0)
  );
  const [pickupLocation, setPickupLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const displayValue = data[selectedIndex?.row];

  const renderOption = (title: string): React.ReactElement => (
    <SelectItem title={title} />
  );

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

  const onSignUp = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/register/`, {
        username,
        email,
        password,
        user_type: String(displayValue).toLowerCase(),
        location: pickupLocation
          ? `${pickupLocation.latitude},${pickupLocation.longitude}`
          : "",
      });
      signIn(response.data);
      router.replace("/");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout
      style={{
        flex: 1,
        paddingTop: insets.top,
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Layout
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "90%",
          alignContent: "center",
        }}
      >
        <Text
          category="h1"
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Waste Not
        </Text>
        <Input
          placeholder="Username"
          label={"Username"}
          value={username}
          autoCapitalize="none"
          onChangeText={(nextValue) => setUsername(nextValue)}
        />
        <Input
          placeholder="Email"
          label={"Email"}
          value={email}
          autoCapitalize="none"
          onChangeText={(nextValue) => setEmail(nextValue)}
        />
        <Input
          placeholder="Enter Password"
          value={password}
          label={"Password"}
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={(nextValue) => setPassword(nextValue)}
        />
        <Select
          style={{
            width: "100%",
            marginTop: 16,
          }}
          placeholder="Default"
          value={displayValue}
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          {data.map(renderOption)}
        </Select>

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

        <Button
          accessoryLeft={
            <IconSymbol size={16} name="plus.app.fill" color="green" />
          }
          appearance="outline"
          status="primary"
          style={{
            width: "100%",
            marginTop: 16,
          }}
          onPress={() => {
            onSignUp();
          }}
          disabled={!email || !password || !username}
        >
          Register
        </Button>
        <Link href={"/sign-in"} style={{ marginTop: 16 }}>
          Already have an account? Sign In
        </Link>
      </Layout>
    </Layout>
  );
}
