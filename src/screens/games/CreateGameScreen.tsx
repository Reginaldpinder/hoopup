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
import Screen from '../../components/Screen';
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
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.location}>{gym?.name ?? 'HoopUp Gym'}</Text>

        <Text style={styles.greeting}>Good morning, Hooper! 👋</Text>
        <Text style={styles.subtitle}>Ready to hoop today?</Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Courts</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>

        {courts.map((court) => (
          <CourtCard
            key={court.id}
            courtName={court.court_name}
            onPress={() => navigation.navigate('CourtDetail', { court })}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.gray,
    marginBottom: SPACING.xl,
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
  },
  viewAll: {
    color: COLORS.orange,
    fontWeight: '800',
  },
});