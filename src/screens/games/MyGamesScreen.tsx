import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getHostedGames, getJoinedGames } from '../../api/games';
import { COLORS, SPACING } from '../../constants/theme';
import { TYPOGRAPHY } from '../../constants/typography';
import { supabase } from '../../lib/supabase';

type AnyGame = any;

export default function MyGamesScreen() {
  const [hostedGames, setHostedGames] = useState<AnyGame[]>([]);
  const [joinedGames, setJoinedGames] = useState<AnyGame[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMyGames();
    }, [])
  );

  async function loadMyGames() {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userId = session?.user?.id;

      if (!userId) {
        Alert.alert('Error', 'You must be logged in.');
        return;
      }

      const hosted = await getHostedGames(userId);
      const joined = await getJoinedGames(userId);

      setHostedGames(hosted || []);
      setJoinedGames(joined || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  function renderGameCard(game: AnyGame, extraLabel?: string) {
    return (
      <View key={`${game.id}-${extraLabel ?? 'game'}`} style={styles.card}>
        <Text style={styles.cardTitle}>{game.title}</Text>

        <Text style={styles.cardDetail}>
          {game.courts?.court_name ?? 'Court'}
        </Text>

        <Text style={styles.cardDetail}>
          {format(new Date(game.start_time), 'MMM d, p')} -{' '}
          {format(new Date(game.end_time), 'p')}
        </Text>

        <Text style={game.is_paid ? styles.paid : styles.free}>
          {game.is_paid ? `$${game.price_per_player} per player` : 'Free'}
        </Text>

        {extraLabel ? <Text style={styles.extraLabel}>{extraLabel}</Text> : null}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const normalizedJoinedGames = joinedGames
    .map((row) => ({
      ...row.games,
      payment_status: row.payment_status,
    }))
    .filter(Boolean);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Games</Text>

      <Text style={styles.sectionTitle}>Hosted Games</Text>

      {hostedGames.length === 0 ? (
        <Text style={styles.emptyText}>You have not hosted any games yet.</Text>
      ) : (
        hostedGames.map((game) => renderGameCard(game, 'Hosting'))
      )}

      <Text style={styles.sectionTitle}>Joined Games</Text>

      {normalizedJoinedGames.length === 0 ? (
        <Text style={styles.emptyText}>You have not joined any games yet.</Text>
      ) : (
        normalizedJoinedGames.map((game) =>
          renderGameCard(
            game,
            game.is_paid ? `Payment: ${game.payment_status}` : 'Joined'
          )
        )
      )}
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
title: {
  ...TYPOGRAPHY.h1,
  color: COLORS.white,
  marginBottom: SPACING.lg,
  marginTop: SPACING.sm,
},
  sectionTitle: {
  ...TYPOGRAPHY.h2,
  color: COLORS.gray,
  marginBottom: SPACING.md,
  marginTop: SPACING.lg,
},
  emptyText: {
    color: '#6b7280',
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#75797f',
  },
cardTitle: {
  ...TYPOGRAPHY.h3,
  color: COLORS.white,
  marginBottom: 6,
},
  cardDetail: {
    color: '#5d6877',
    marginBottom: 4,
  },
  paid: {
    marginTop: 8,
    fontWeight: '700',
    color: '#b45309',
  },
  free: {
    marginTop: 8,
    fontWeight: '700',
    color: '#047857',
  },
  extraLabel: {
    marginTop: 8,
    fontWeight: '700',
    color: '#b9bdc7',
  },
});