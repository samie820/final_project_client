import { Stack } from "expo-router";
import "react-native-reanimated";

export default function MyRequestLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="reservedDonations" options={{ headerTitle: 'My Reserved Donations', headerBackTitle: 'Back' }} />
      <Stack.Screen name="findVolunteers" options={{ headerTitle: 'Find Volunteers', headerBackTitle: 'Back' }} />
    </Stack>
  );
}
