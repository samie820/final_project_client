import { Link, router } from "expo-router";
import { Platform, View } from "react-native";

import { useSession } from "../components/AuthContext";
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";

export default function SignIn() {
  const { signIn } = useSession();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = async () => {
    try {
      const response = await axios.post(Platform.OS == 'android' ? `http://10.0.2.2:8000/api/token/` : `http://127.0.0.1:8000/api/token/`, {
        username: email,
        password,
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
        <Text category="h1" style={{
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 16,
          textAlign: "center",
        }}>Waste Not</Text>
        <Input
          placeholder="Username"
          label={"Username"}
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
            onSignIn();
          }}
          disabled={!email || !password}
        >
          Sign In
        </Button>
        <Link href={"/sign-up"} style={{ marginTop: 16 }}>
        Don't have an account? Sign Up
        </Link>
      </Layout>
    </Layout>
  );
}
