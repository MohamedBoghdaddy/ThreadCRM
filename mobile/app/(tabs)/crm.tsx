import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { styled } from 'nativewind';
import { getDashboard, getLeads, createLead } from '../../src/api/crm';

// Styled components using NativeWind for consistent styling
const Container = styled(View);
const Title = styled(Text);
const Section = styled(View);
const StatText = styled(Text);
const Input = styled(TextInput);
const Button = styled(Pressable);

export default function CRMScreen() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [dash, list] = await Promise.all([getDashboard(), getLeads()]);
      setDashboard(dash);
      setLeads(list);
    } catch (err) {
      Alert.alert('Error', 'Failed to load CRM data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addLead = async () => {
    try {
      setLoading(true);
      await createLead({
        name: leadName,
        email: leadEmail,
        phone: leadPhone
      });
      setLeadName('');
      setLeadEmail('');
      setLeadPhone('');
      setShowForm(false);
      loadData();
    } catch (err) {
      Alert.alert('Error', 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="flex-1 p-4 bg-white">
      <Title className="text-2xl font-bold mb-4">CRM Dashboard</Title>
      {dashboard && (
        <Section className="mb-4">
          <StatText>Total Leads: {dashboard.totalLeads}</StatText>
          <StatText>Hot Leads: {dashboard.hotLeads}</StatText>
        </Section>
      )}
      <Button
        className="bg-blue-600 rounded-md px-4 py-2 mb-4 w-fit"
        onPress={() => setShowForm(!showForm)}
      >
        <Text className="text-white">{showForm ? 'Cancel' : 'Add Lead'}</Text>
      </Button>
      {showForm && (
        <Section className="mb-4">
          <Input
            value={leadName}
            onChangeText={setLeadName}
            placeholder="Name"
            className="border border-gray-300 rounded-md p-2 mb-2"
          />
          <Input
            value={leadEmail}
            onChangeText={setLeadEmail}
            placeholder="Email"
            keyboardType="email-address"
            className="border border-gray-300 rounded-md p-2 mb-2"
          />
          <Input
            value={leadPhone}
            onChangeText={setLeadPhone}
            placeholder="Phone"
            keyboardType="phone-pad"
            className="border border-gray-300 rounded-md p-2 mb-2"
          />
          <Button
            className={`rounded-md px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-green-600'}`}
            onPress={addLead}
            disabled={loading}
          >
            <Text className="text-white">{loading ? 'Saving...' : 'Save Lead'}</Text>
          </Button>
        </Section>
      )}
      <FlatList
        data={leads}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Section className="border-b border-gray-200 py-3">
            <Text className="font-bold">{item.name}</Text>
            {item.email ? <Text>{item.email}</Text> : null}
            {item.phone ? <Text>{item.phone}</Text> : null}
            <Text>Status: {item.status}</Text>
          </Section>
        )}
      />
    </Container>
  );
}
