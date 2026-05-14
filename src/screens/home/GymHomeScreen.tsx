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
import { COLORS, SPACING } from '../../constants/theme';
import { TYPOGRAPHY } from '../../constants/typography';

type Gym = {
  id: number;
  name: string;
  address: string;
};

type Court = {
  id: number;
  court_name: string;
};

export default function GymHomeScreen({ navigation }: any) {
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
          onPress={() => navigation.navigate('CourtDetail', { court })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  ...TYPOGRAPHY.h2,
  color: COLORS.white,
  marginBottom: SPACING.md,
  marginTop: SPACING.lg,
},
});