import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, Alert } from 'react-native';
import { styled } from 'nativewind';
import { router } from 'expo-router';
import { login } from '../../src/api/auth';
import { saveToken, saveUserId } from '../../src/store/authStore';

// Styled components for the login screen
const Container = styled(View);
const Title = styled(Text);
const Input = styled(TextInput);
const Button = styled(Pressable);
const LinkButton = styled(Pressable);

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { token, user } = await login({ email, password });
      await saveToken(token);
      await saveUserId(user.id);
      router.replace('/(tabs)/home');
    } catch (err) {
      Alert.alert('Login failed', err?.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="flex-1 justify-center p-4 bg-white">
      <Title className="text-2xl font-bold mb-6">Login</Title>
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
        onPress={handleLogin}
        disabled={loading}
        className={`rounded-md p-3 ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
      >
        <Text className="text-white text-center font-medium">
          {loading ? 'Loading...' : 'Login'}
        </Text>
      </Button>
      <LinkButton
        className="mt-4"
        onPress={() => router.push('/(auth)/register')}
      >
        <Text className="text-blue-600 text-center">Create Account</Text>
      </LinkButton>
    </Container>
  );
}
