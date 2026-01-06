import "../../global.css";

import React, { useState } from "react";
import { View, TextInput, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";

import { login as loginUser } from "../../src/api/auth";
import { saveToken, saveUserId } from "../../src/store/authStore";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const { token, user } = await loginUser({
        email: email.trim(),
        password,
      });

      await saveToken(token);

      const userId = user?._id || user?.id;
      if (userId) await saveUserId(userId);

      router.replace("/(tabs)/home");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password";
      Alert.alert("Login failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">Login</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 rounded-md px-4 py-3 mb-3"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 rounded-md px-4 py-3 mb-4"
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className={`rounded-md py-3 ${loading ? "bg-gray-400" : "bg-black"}`}
      >
        <Text className="text-white text-center font-medium">
          {loading ? "Loading..." : "Login"}
        </Text>
      </Pressable>

      <Pressable
        className="mt-4"
        onPress={() => router.push("/(auth)/register")}
        disabled={loading}
      >
        <Text className="text-blue-600 text-center">Create a new account</Text>
      </Pressable>
    </View>
  );
}
