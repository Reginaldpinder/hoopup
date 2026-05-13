import { format } from 'date-fns';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
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
  backgroundColor: COLORS.darkCard,
  borderRadius: RADIUS.lg,
  padding: SPACING.lg,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: COLORS.border,
},
title: {
  fontSize: 22,
  fontWeight: '800',
  color: COLORS.white,
  marginBottom: 6,
},
detail: {
  color: COLORS.gray,
  marginBottom: 4,
},
paid: {
  marginTop: 8,
  fontWeight: '800',
  color: COLORS.orange,
},
free: {
  marginTop: 8,
  fontWeight: '800',
  color: COLORS.gold,
},
joinButton: {
  marginTop: 14,
  backgroundColor: COLORS.orange,
  padding: 14,
  borderRadius: RADIUS.md,
},
leaveButton: {
  marginTop: 14,
  backgroundColor: COLORS.danger,
  padding: 14,
  borderRadius: RADIUS.md,
},
disabledButton: {
  backgroundColor: '#4B5563',
},
buttonText: {
  color: COLORS.white,
  textAlign: 'center',
  fontWeight: '800',
},
cancelled: {
  marginTop: 6,
  fontWeight: '800',
  color: COLORS.danger,
},
});