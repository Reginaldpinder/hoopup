import { format } from 'date-fns';
import { StyleSheet, Text, View } from 'react-native';

type GameCardProps = {
  title: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  isPaid: boolean;
  pricePerPlayer?: number | null;
};

export default function GameCard({
  title,
  startTime,
  endTime,
  maxPlayers,
  isPaid,
  pricePerPlayer,
}: GameCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.detail}>
        {format(new Date(startTime), 'p')} - {format(new Date(endTime), 'p')}
      </Text>

      <Text style={styles.detail}>Max Players: {maxPlayers}</Text>

      <Text style={isPaid ? styles.paid : styles.free}>
        {isPaid ? `$${pricePerPlayer} per player` : 'Free'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  detail: {
    color: '#4b5563',
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
});