import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";

import { getThreads } from "../../src/api/chat";

type ThreadItem = {
  _id: string;
  updatedAt?: string;
  title?: string;
  lastMessage?: string;
};

export default function ChatsScreen() {
  const router = useRouter();
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadThreads = async () => {
    try {
      setLoading(true);
      const list = await getThreads();
      setThreads(Array.isArray(list) ? list : []);
    } catch {
      Alert.alert("Error", "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const openThread = (id: string) => {
    // If your route is app/(tabs)/chat/[id].tsx
    router.push(`/(tabs)/chat/${id}`);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Chats</Text>

      {loading && <Text className="text-gray-600 mb-2">Loading...</Text>}

      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={loadThreads}
        ListEmptyComponent={
          !loading ? <Text className="text-gray-500">No chats yet.</Text> : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openThread(item._id)}
            className="border-b border-gray-200 py-3"
          >
            <Text className="font-bold">
              {item.title || `Thread ${item._id.slice(-6)}`}
            </Text>

            {!!item.lastMessage && (
              <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
                {item.lastMessage}
              </Text>
            )}

            <Text className="text-xs text-gray-500 mt-1">
              Updated:{" "}
              {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "—"}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
