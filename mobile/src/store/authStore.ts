import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function saveUserId(userId: string) {
  await AsyncStorage.setItem(USER_ID_KEY, userId);
}

export async function getUserId() {
  return AsyncStorage.getItem(USER_ID_KEY);
}

export async function clearUserId() {
  await AsyncStorage.removeItem(USER_ID_KEY);
}
