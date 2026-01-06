import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { styled } from 'nativewind';
import { getThreads } from '../../src/api/chat';
import { router } from 'expo-router';

const Container = styled(View);
const Title = styled(Text);
const Item = styled(Pressable);

export default function ChatsScreen() {
  const [threads, setThreads] = useState<any[]>([]);

  const loadThreads = async () => {
    try {
      const list = await getThreads();
      setThreads(list);
    } catch (err) {
      Alert.alert('Error', 'Failed to load chats');
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const openThread = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container className="flex-1 p-4 bg-white">
      <Title className="text-2xl font-bold mb-4">Chats</Title>
      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Item
            onPress={() => openThread(item._id)}
            className="border-b border-gray-200 py-3"
          >
            <Text className="font-bold">{item._id}</Text>
            <Text className="text-sm text-gray-600">
              Updated: {new Date(item.updatedAt).toLocaleString()}
            </Text>
          </Item>
        )}
      />
    </Container>
  );
}
