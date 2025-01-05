import { Stack } from "expo-router";
import "react-native-reanimated";

export default function DonateLayout() {
  return (
    <Stack>
      <Stack.Screen name="pastDonations" options={{ headerShown: false }} />
    </Stack>
  );
}
