import { router } from "expo-router";
import { Text, View } from "react-native";

import { useSession } from "../components/AuthContext";
import { Button, Input, Layout } from "@ui-kitten/components";
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
      const response = await axios.post(`http://127.0.0.1:8000/api/token/`, {
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
        <Input
          placeholder="Email"
          label={"Email"}
          value={email}
          autoCapitalize="none"
          onChangeText={(nextValue) => setEmail(nextValue)}
        />
        <Input
          placeholder="Enter Number of Items"
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
      </Layout>
    </Layout>
  );
}
