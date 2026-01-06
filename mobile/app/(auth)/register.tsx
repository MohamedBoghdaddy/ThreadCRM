import React, { useState } from "react";
import { View, TextInput, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";

import { register as registerUser } from "../../src/api/auth";
import { saveToken, saveUserId } from "../../src/store/authStore";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Missing info", "Please fill in name, email, and password.");
      return;
    }

    try {
      setLoading(true);

      const { token, user } = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      await saveToken(token);

      // Mongo usually returns _id. Fallbacks included.
      const userId = user?._id || user?.id;
      if (userId) await saveUserId(userId);

      router.replace("/(tabs)/home");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Something went wrong";
      Alert.alert("Register failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">Register</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        className="border border-gray-300 rounded-md px-4 py-3 mb-3"
      />

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
        onPress={handleRegister}
        disabled={loading}
        className={`rounded-md py-3 ${
          loading ? "bg-gray-400" : "bg-green-600"
        }`}
      >
        <Text className="text-white text-center font-medium">
          {loading ? "Loading..." : "Register"}
        </Text>
      </Pressable>

      <Pressable
        className="mt-4"
        onPress={() => router.push("/(auth)/login")}
        disabled={loading}
      >
        <Text className="text-blue-600 text-center">Back to Login</Text>
      </Pressable>
    </View>
  );
}
