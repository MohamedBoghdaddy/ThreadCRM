import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { getDashboard, getLeads, createLead } from "../../src/api/crm";

type Dashboard = {
  totalLeads?: number;
  hotLeads?: number;
};

type Lead = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
};

export default function CRMScreen() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [dash, list] = await Promise.all([getDashboard(), getLeads()]);
      setDashboard(dash || null);
      setLeads(Array.isArray(list) ? list : []);
    } catch {
      Alert.alert("Error", "Failed to load CRM data");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addLead = async () => {
    if (!leadName.trim()) {
      Alert.alert("Missing info", "Lead name is required.");
      return;
    }

    try {
      setLoading(true);

      await createLead({
        name: leadName.trim(),
        email: leadEmail.trim() || undefined,
        phone: leadPhone.trim() || undefined,
      });

      setLeadName("");
      setLeadEmail("");
      setLeadPhone("");
      setShowForm(false);

      await loadData();
    } catch {
      Alert.alert("Error", "Failed to add lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">CRM Dashboard</Text>

      {dashboard && (
        <View className="mb-4">
          <Text className="text-gray-900">
            Total Leads: {dashboard.totalLeads ?? 0}
          </Text>
          <Text className="text-gray-900">
            Hot Leads: {dashboard.hotLeads ?? 0}
          </Text>
        </View>
      )}

      <Pressable
        className="bg-blue-600 rounded-md px-4 py-2 mb-4 self-start"
        onPress={() => setShowForm((v) => !v)}
      >
        <Text className="text-white">{showForm ? "Cancel" : "Add Lead"}</Text>
      </Pressable>

      {showForm && (
        <View className="mb-4">
          <TextInput
            value={leadName}
            onChangeText={setLeadName}
            placeholder="Name"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
          />

          <TextInput
            value={leadEmail}
            onChangeText={setLeadEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
          />

          <TextInput
            value={leadPhone}
            onChangeText={setLeadPhone}
            placeholder="Phone"
            keyboardType="phone-pad"
            className="border border-gray-300 rounded-md px-3 py-2 mb-3"
          />

          <Pressable
            className={`rounded-md px-4 py-2 ${
              loading ? "bg-gray-400" : "bg-green-600"
            }`}
            onPress={addLead}
            disabled={loading}
          >
            <Text className="text-white text-center">
              {loading ? "Saving..." : "Save Lead"}
            </Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={leads}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={loadData}
        ListEmptyComponent={
          !refreshing ? (
            <Text className="text-gray-500 mt-2">No leads yet.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-3">
            <Text className="font-bold">{item.name}</Text>
            {!!item.email && <Text>{item.email}</Text>}
            {!!item.phone && <Text>{item.phone}</Text>}
            <Text>Status: {item.status || "—"}</Text>
          </View>
        )}
      />
    </View>
  );
}
