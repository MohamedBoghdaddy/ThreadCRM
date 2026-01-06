import React from 'react';
import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';
import { clearToken, clearUserId } from ../../src/store/authStoresrc/store/authStore';

export default function HomeScreen() {
  const logout = async () => {
    await clearToken();
    await clearUserId();
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl mb-5 font-bold">Welcome</Text>
      <Button title="Go to CRM Dashboard" onPress={() => router.push('/(tabs)/crm')} />
      <View style={{ height: 12 }} />
      <Button title="Go to Chats" onPress={() => router.push('/(tabs)/chats')} />
      <View style={{ height: 12 }} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
