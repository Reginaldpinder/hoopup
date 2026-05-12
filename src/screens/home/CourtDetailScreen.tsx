import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getGamesByCourt, joinGame, leaveGame } from '../../api/games';
import GameCard from '../../components/GameCard';
import { supabase } from '../../lib/supabase';

type GamePlayer = {
  id: number;
  user_id: string;
  status: string;
  payment_status: string;
};

type Game = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  max_players: number;
  is_paid: boolean;
  price_per_player: number | null;
  game_players: GamePlayer[];
};

export default function CourtDetailScreen({ route, navigation }: any) {
  const { court } = route.params;

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadUserAndGames();
    }, [])
  );

  async function loadUserAndGames() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setCurrentUserId(session?.user?.id ?? null);

    await loadGames();
  }

  async function loadGames() {
    try {
      const data = await getGamesByCourt(court.id);
      setGames(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinGame(gameId: number) {
    try {
      await joinGame(gameId);
      await loadGames();
    } catch (error: any) {
      Alert.alert('Join failed', error.message);
    }
  }

  async function handleLeaveGame(gameId: number) {
    try {
      await leaveGame(gameId);
      await loadGames();
    } catch (error: any) {
      Alert.alert('Leave failed', error.message);
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
      <Text style={styles.title}>{court.court_name}</Text>

      <Text style={styles.sectionTitle}>Games</Text>

      <Pressable
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateGame', { court })}
      >
        <Text style={styles.createButtonText}>+ Create Game</Text>
      </Pressable>

      {games.length === 0 ? (
        <Text style={styles.emptyText}>
          No games scheduled for this court yet.
        </Text>
      ) : (
        games.map((game) => {
          const joinedPlayers =
            game.game_players?.filter((player) => player.status === 'joined') ??
            [];

          const userJoined = joinedPlayers.some(
            (player) => player.user_id === currentUserId
          );

          return (
            <GameCard
              key={game.id}
              title={game.title}
              startTime={game.start_time}
              endTime={game.end_time}
              maxPlayers={game.max_players}
              isPaid={game.is_paid}
              pricePerPlayer={game.price_per_player}
              joinedCount={joinedPlayers.length}
              userJoined={userJoined}
              onJoin={() => handleJoinGame(game.id)}
              onLeave={() => handleLeaveGame(game.id)}
              onPress={() => navigation.navigate('GameDetail', { gameId: game.id })}
            />
          );
        })
      )}
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
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});