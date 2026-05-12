import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { getGamesByCourt } from '../../api/games';
import GameCard from '../../components/GameCard';

type Game = {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  max_players: number;
  is_paid: boolean;
  price_per_player: number | null;
};

export default function CourtDetailScreen({ route, navigation }: any){
  const { court } = route.params;

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

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
        onPress={() =>
            navigation.navigate('CreateGame', { court })
        }
        >
        <Text style={styles.createButtonText}>+ Create Game</Text>
        </Pressable>
        
      {games.length === 0 ? (
        <Text style={styles.emptyText}>No games scheduled for this court yet.</Text>
      ) : (
        games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            startTime={game.start_time}
            endTime={game.end_time}
            maxPlayers={game.max_players}
            isPaid={game.is_paid}
            pricePerPlayer={game.price_per_player}
          />
        ))
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