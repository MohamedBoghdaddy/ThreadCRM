import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, Pressable, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useLocalSearchParams } from 'expo-router';
import { socket } from '../../src/realtime/socket';
import { getMessages } from '../../src/api/chat';
import { getUserId } from '../../src/store/authStore';

// Styled components for the chat room
const Container = styled(View);
const MsgContainer = styled(View);
const MsgText = styled(Text);
const Timestamp = styled(Text);
const Input = styled(TextInput);
const SendButton = styled(Pressable);

export default function ChatRoom() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const loadMessages = useCallback(async () => {
    if (!threadId) return;
    try {
      const list = await getMessages(threadId);
      setMessages(list);
    } catch (err) {
      Alert.alert('Error', 'Failed to load messages');
    }
  }, [threadId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!threadId) return;

    socket.emit('joinThread', threadId);

    const handler = (msg: any) => setMessages((prev) => [...prev, msg]);
    socket.on('newMessage', handler);

    return () => {
      socket.off('newMessage', handler);
      socket.emit('leaveThread', threadId);
    };
  }, [threadId]);

  const send = async () => {
    if (!text.trim() || !threadId) return;
    try {
      const senderId = await getUserId();
      socket.emit('sendMessage', { threadId, senderId, text });
      setText('');
    } catch (err) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <Container className="flex-1 p-3 bg-white">
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MsgContainer className="mb-2">
            <MsgText>{item.text}</MsgText>
            <Timestamp className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleString()}
            </Timestamp>
          </MsgContainer>
        )}
      />
      <Input
        value={text}
        onChangeText={setText}
        placeholder="Message..."
        className="border border-gray-300 rounded-md p-2 my-2"
      />
      <SendButton
        className={`rounded-md p-3 ${text.trim() ? 'bg-blue-600' : 'bg-gray-300'}`}
        onPress={send}
        disabled={!text.trim()}
      >
        <Text className="text-white text-center font-medium">Send</Text>
      </SendButton>
    </Container>
  );
}
