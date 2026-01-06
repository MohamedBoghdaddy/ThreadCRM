import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getSocket } from "../../src/realtime/socket";
import { getMessages } from "../../src/api/chat";
import { getUserId } from "../../src/store/authStore";

type ChatMessage = {
  _id: string;
  text: string;
  createdAt: string;
  senderId?: string;
};

export default function ChatRoom() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const id = useMemo(
    () => (typeof threadId === "string" ? threadId : ""),
    [threadId]
  );

  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const loadMessages = useCallback(async () => {
    if (!id) return;
    try {
      const list = await getMessages(id);
      setMessages(Array.isArray(list) ? list : []);
    } catch {
      Alert.alert("Error", "Failed to load messages");
    }
  }, [id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!id) return;

    const socket = getSocket();
    if (!socket) return; // web: sockets disabled

    socket.emit("joinThread", id);

    const handler = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
      socket.emit("leaveThread", id);
    };
  }, [id]);

  const send = async () => {
    if (!text.trim() || !id) return;

    try {
      const socket = getSocket();
      if (!socket) {
        Alert.alert("Web limitation", "Realtime chat is disabled on web.");
        return;
      }

      const senderId = await getUserId();

      socket.emit("sendMessage", {
        threadId: id,
        senderId,
        text: text.trim(),
      });

      setText("");
    } catch {
      Alert.alert("Error", "Failed to send message");
    }
  };

  return (
    <View className="flex-1 p-3 bg-white">
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 8 }}
        renderItem={({ item }) => (
          <View className="mb-2">
            <Text className="text-base">{item.text}</Text>
            <Text className="text-xs text-gray-500">
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
            </Text>
          </View>
        )}
      />

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Message..."
        className="border border-gray-300 rounded-md px-3 py-2 my-2"
      />

      <Pressable
        className={`rounded-md p-3 ${
          text.trim() ? "bg-blue-600" : "bg-gray-300"
        }`}
        onPress={send}
        disabled={!text.trim()}
      >
        <Text className="text-white text-center font-medium">Send</Text>
      </Pressable>
    </View>
  );
}
