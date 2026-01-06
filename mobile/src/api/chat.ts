import { api } from './client';

export async function getThreads() {
  const res = await api.get('/chat/threads');
  return res.data;
}

export async function createThread(participantIds: string[]) {
  const res = await api.post('/chat/threads', { participantIds });
  return res.data;
}

export async function getMessages(threadId: string) {
  const res = await api.get(`/chat/threads/${threadId}/messages`);
  return res.data;
}
