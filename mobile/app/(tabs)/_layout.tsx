import { Tabs } from "expo-router";
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { getToken } from '../../src/store/authStore';

export default function TabsLayout() {
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();
      if (!token) {
        router.replace('/(auth)/login');
      }
      setAuthLoaded(true);
    }
    checkAuth();
  }, []);

  if (!authLoaded) {
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="crm" options={{ title: 'CRM' }} />
      <Tabs.Screen name="chats" options={{ title: 'Chats' }} />
    </Tabs>
  );
}
