import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useSession } from "../../components/AuthContext";
import { Layout, Spinner } from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  console.log('session ======>', session);

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return (
      <Layout style={{ flex: 1 }}>
        <SafeAreaView
          style={{
            height: "100%",
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            flexWrap: 'wrap',
          }}
        >
          <Spinner size="giant" />
        </SafeAreaView>
      </Layout>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
