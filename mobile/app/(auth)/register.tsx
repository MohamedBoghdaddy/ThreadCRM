import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, Alert } from 'react-native';
import { styled } from 'nativewind'../../src/api/auth' from 'expo-router';
import { register as registerUser } from '../../src/api/auth'/auth';
import { saveToken, saveUserId } from '../../src/store/authStore';

const Container = styled(View);
const Title = styled(Text);
const Input = styled(TextInput);
const Button = styled(Pressable);
const LinkButton = styled(Pressable);

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const { token, user } = await registerUser({ name, email, password });
      await saveToken(token);
      await saveUserId(user.id);
      router.replace('/(tabs)/home');
    } catch (err) {
      Alert.alert('Register failed', err?.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="flex-1 justify-center p-4 bg-white">
      <Title className="text-2xl font-bold mb-6">Register</Title>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Name"
        className="border border-gray-300 rounded-md p-3 mb-3"
      />
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 rounded-md p-3 mb-3"
      />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 rounded-md p-3 mb-4"
      />
      <Button
        onPress={handleRegister}
        disabled={loading}
        className={`rounded-md p-3 ${loading ? 'bg-gray-400' : 'bg-green-600'}`}
      >
        <Text className="text-white text-center font-medium">
          {loading ? 'Loading...' : 'Register'}
        </Text>
      </Button>
      <LinkButton className="mt-4" onPress={() => router.push('/(auth)/login')}>
        <Text className="text-blue-600 text-center">Back to Login</Text>
      </LinkButton>
    </Container>
  );
}
