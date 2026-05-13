import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
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

import { joinGame, leaveGame, updatePaymentStatus } from '../../api/games';
import { supabase } from '../../lib/supabase';


type GamePlayer = {
  id: number;
  user_id: string;
  status: string;
  payment_status: string;
  payment_note: string | null;
  profiles?: {
    username: string;
    display_name: string;
  };
};

type Game = {
  id: number;
  title: string;
  notes: string | null;
  start_time: string;
  end_time: string;
  max_players: number;
  status: string;
  is_paid: boolean;
  price_per_player: number | null;
  host_id: string;
  courts?: {
    court_name: string;
  };
  game_players: GamePlayer[];
};

export default function GameDetailScreen({ route }: any) {
  const { gameId } = route.params;

  const [game, setGame] = useState<Game | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadGameDetail();
    }, [])
  );

  async function loadGameDetail() {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setCurrentUserId(session?.user?.id ?? null);

      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          courts (
            court_name
          ),
          game_players (
            id,
            user_id,
            status,
            payment_status,
            payment_note,
            profiles!game_players_user_id_fkey (
                        username,
                        display_name
                        )
          )
        `)
        .eq('id', gameId)
        .single();

      if (error) {
        console.log('Game detail error:', error);
        Alert.alert('Game detail error', error.message);
        throw error;
        }

      setGame(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!game) return;

    try {
      await joinGame(game.id);
      await loadGameDetail();
    } catch (error: any) {
      Alert.alert('Join failed', error.message);
    }
  }

  async function handleLeave() {
    if (!game) return;

    try {
      await leaveGame(game.id);
      await loadGameDetail();
    } catch (error: any) {
      Alert.alert('Leave failed', error.message);
    }
  }

async function handleUpdatePayment(
  playerUserId: string,
  paymentStatus: 'paid' | 'unpaid'
) {
  if (!game) return;

  try {
    await updatePaymentStatus(game.id, playerUserId, paymentStatus);
    await loadGameDetail();
  } catch (error: any) {
    Alert.alert('Payment update failed', error.message);
  }
}


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.centered}>
        <Text>Game not found.</Text>
      </View>
    );
  }

 

  const joinedPlayers =
    game.game_players?.filter((player) => player.status === 'joined') ?? [];

  const userJoined = joinedPlayers.some(
    (player) => player.user_id === currentUserId
  );

  const isHost = game.host_id === currentUserId;
  const isFull = joinedPlayers.length >= game.max_players;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{game.title}</Text>

      <Text style={styles.detail}>{game.courts?.court_name}</Text>

      <Text style={styles.detail}>
        {format(new Date(game.start_time), 'MMM d, p')} -{' '}
        {format(new Date(game.end_time), 'p')}
      </Text>

      <Text style={styles.detail}>Status: {game.status}</Text>

      <Text style={styles.detail}>
        Players: {joinedPlayers.length} / {game.max_players}
      </Text>

      <Text style={game.is_paid ? styles.paid : styles.free}>
        {game.is_paid ? `$${game.price_per_player} per player` : 'Free Game'}
      </Text>

      {game.notes ? (
        <>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{game.notes}</Text>
        </>
      ) : null}

      <Text style={styles.sectionTitle}>Players</Text>

      {joinedPlayers.length === 0 ? (
        <Text style={styles.emptyText}>No players have joined yet.</Text>
      ) : (
        joinedPlayers.map((player) => (
        <View key={player.id} style={styles.playerRow}>
            <View>
            <Text style={styles.playerName}>
                {player.profiles?.display_name ?? player.profiles?.username ?? 'Player'}
            </Text>

            {game.is_paid ? (
                <Text style={styles.paymentText}>
                Payment: {player.payment_status}
                </Text>
            ) : null}
            </View>

            {game.is_paid && isHost ? (
            player.payment_status === 'paid' ? (
                <Pressable
                style={styles.unpaidButton}
                onPress={() => handleUpdatePayment(player.user_id, 'unpaid')}
                >
                <Text style={styles.smallButtonText}>Mark Unpaid</Text>
                </Pressable>
            ) : (
                <Pressable
                style={styles.paidButton}
                onPress={() => handleUpdatePayment(player.user_id, 'paid')}
                >
                <Text style={styles.smallButtonText}>Mark Paid</Text>
                </Pressable>
            )
            ) : null}
        </View>
        ))
      )}

      {userJoined ? (
        <Pressable style={styles.leaveButton} onPress={handleLeave}>
          <Text style={styles.buttonText}>Leave Game</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.joinButton, isFull && styles.disabledButton]}
          onPress={handleJoin}
          disabled={isFull}
        >
          <Text style={styles.buttonText}>
            {isFull ? 'Game Full' : 'Join Game'}
          </Text>
        </Pressable>
      )}

      {isHost ? (
        <Text style={styles.hostText}>You are hosting this game.</Text>
      ) : null}
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
    marginBottom: 8,
    marginTop: 12,
  },
  detail: {
    color: '#4b5563',
    marginBottom: 6,
    fontSize: 16,
  },
  paid: {
    marginTop: 8,
    fontWeight: '800',
    color: '#b45309',
  },
  free: {
    marginTop: 8,
    fontWeight: '800',
    color: '#047857',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 12,
  },
  notes: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    color: '#374151',
  },
  emptyText: {
    color: '#6b7280',
  },
  playerRow: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerName: {
    fontWeight: '700',
  },
  paymentText: {
    fontWeight: '700',
    color: '#b45309',
    textTransform: 'capitalize',
  },
  joinButton: {
    marginTop: 28,
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 10,
  },
  leaveButton: {
    marginTop: 28,
    backgroundColor: '#991b1b',
    padding: 16,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
  },
  hostText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 40,
    fontWeight: '700',
    color: '#374151',
  },
  paidButton: {
  backgroundColor: '#047857',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 8,
},
unpaidButton: {
  backgroundColor: '#b45309',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 8,
},
smallButtonText: {
  color: '#fff',
  fontWeight: '700',
},
});