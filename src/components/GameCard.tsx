import { format } from 'date-fns';
import { Pressable, StyleSheet, Text } from 'react-native';

type GameCardProps = {
  title: string;
  startTime: string;
  endTime: string;
  maxPlayers: number;
  isPaid: boolean;
  pricePerPlayer?: number | null;
  joinedCount: number;
  userJoined: boolean;
  status: string;
  onJoin: () => void;
  onLeave: () => void;
  onPress?: () => void;
};

export default function GameCard({
  title,
  startTime,
  endTime,
  maxPlayers,
  isPaid,
  pricePerPlayer,
  joinedCount,
  userJoined,
  status,
  onJoin,
  onLeave,
  onPress,
}: GameCardProps) {
  const isFull = joinedCount >= maxPlayers;
  const isClosed = isFull || status === 'cancelled';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.detail}>
        {format(new Date(startTime), 'p')} - {format(new Date(endTime), 'p')}
      </Text>

      <Text style={styles.detail}>
        Players: {joinedCount} / {maxPlayers}
      </Text>

      {status === 'cancelled' ? (
          <Text style={styles.cancelled}>Cancelled</Text>
        ) : null}

      <Text style={isPaid ? styles.paid : styles.free}>
        {isPaid ? `$${pricePerPlayer} per player` : 'Free'}
      </Text>

      {userJoined ? (
        <Pressable style={styles.leaveButton} onPress={onLeave}>
          <Text style={styles.buttonText}>Leave Game</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.joinButton, isClosed && styles.disabledButton]}
          onPress={onJoin}
          disabled={isClosed}
        >
          <Text style={styles.buttonText}>
            {status === 'cancelled'
              ? 'Cancelled'
              : isFull
              ? 'Game Full'
              : 'Join Game'}
          </Text>
        </Pressable>
      )}
    </Pressable>
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
  joinButton: {
    marginTop: 14,
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 10,
  },
  leaveButton: {
    marginTop: 14,
    backgroundColor: '#991b1b',
    padding: 12,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '700',
  },
  cancelled: {
  marginTop: 6,
  fontWeight: '800',
  color: '#991b1b',
  },
});