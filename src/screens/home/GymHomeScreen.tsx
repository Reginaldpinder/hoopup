import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getCourts, getGym } from '../../api/courts';
import CourtCard from '../../components/CourtCard';

type Gym = {
  id: number;
  name: string;
  address: string;
};

type Court = {
  id: number;
  court_name: string;
};

export default function GymHomeScreen() {
  const [gym, setGym] = useState<Gym | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGymData();
  }, []);

  async function loadGymData() {
    try {
      const gymData = await getGym();
      const courtsData = await getCourts();

      setGym(gymData);
      setCourts(courtsData || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.gymName}>{gym?.name}</Text>

      <Text style={styles.sectionTitle}>Courts</Text>

      {courts.map((court) => (
        <CourtCard
          key={court.id}
          courtName={court.court_name}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gymName: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
});