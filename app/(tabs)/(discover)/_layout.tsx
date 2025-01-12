import { Stack } from "expo-router";
import "react-native-reanimated";

export default function DonateLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="donationDetail" options={{ headerShown: true, headerTitle: '', headerBackTitle: 'Back' }} />
    </Stack>
  );
}
