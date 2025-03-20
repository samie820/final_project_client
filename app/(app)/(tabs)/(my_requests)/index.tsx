import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Layout,
  Card,
  Text,
  TopNavigation,
  MenuItem,
  OverflowMenu,
  TopNavigationAction,
  Icon,
  IconElement,
} from "@ui-kitten/components";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { useSession } from "@/components/AuthContext";

const mockedMenu = [
  {
    id: 2,
    name: "Reserved Donations",
    description:
      "Donations you have reserved that you can collect yourself or find a volunteer to pick it up for you",
    icon: "fork.knife.circle.fill",
    link: "/(tabs)/(my_requests)/reservedDonations",
  },
  {
    id: 3,
    name: "Available Assignments",
    description:
      "As a volunteer, click here to see a list of requests made by donation recipients",
    icon: "car.circle",
    link: "/(tabs)/(my_requests)/reservedDonations",
  },
  {
    id: 4,
    name: "Manage Schedule",
    description: "As a volunteer, manage your weekly availability",
    icon: "calendar",
    link: "/(tabs)/(my_requests)/reservedDonations",
  },
];

const LogoutIcon = (): IconElement => (
  <IconSymbol size={28} name="square.and.arrow.up" color="black" />
);

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useSession();

  const renderItem = ({ item }: { item: any }) => (
    <Card
      onPress={() => {
        router.push(item.link);
      }}
      style={styles.card}
    >
      <Layout
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <Layout
          style={{
            width: "80%",
            backgroundColor: "transparent",
          }}
        >
          <Layout
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <IconSymbol size={28} name={item.icon} color="green" />
            <Text
              category="h6"
              style={{
                marginStart: 8,
              }}
            >
              {item.name}
            </Text>
          </Layout>
          <Text
            style={{
              fontSize: 14,
              marginTop: 8,
            }}
          >
            {item.description}
          </Text>
        </Layout>
        <IconSymbol size={18} name="chevron.forward" color="green" />
      </Layout>
    </Card>
  );

  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={LogoutIcon}
      onPress={() => {
        signOut();
      }}
    />
  );

  return (
    <Layout style={{ flex: 1, paddingTop: insets.top }}>
      <TopNavigation accessoryRight={renderMenuAction} />
      <FlatList
        style={{
          backgroundColor: "#f5f5f5",
          paddingHorizontal: 8,
          marginTop: 8,
        }}
        data={mockedMenu}
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
    marginStart: 8,
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
