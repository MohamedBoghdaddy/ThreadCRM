import { api } from './client';

export interface LeadPayload {
  name: string;
  email?: string;
  phone?: string;
  status?: 'new' | 'hot' | 'cold';
  notes?: string;
}

export async function getDashboard() {
  const res = await api.get('/crm/dashboard');
  return res.data;
}

export async function getLeads() {
  const res = await api.get('/crm/leads');
  return res.data;
}

export async function createLead(payload: LeadPayload) {
  const res = await api.post('/crm/leads', payload);
  return res.data;
}
