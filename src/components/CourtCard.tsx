import { Pressable, StyleSheet, Text } from 'react-native';

type CourtCardProps = {
  courtName: string;
  onPress?: () => void;
};

export default function CourtCard({
  courtName,
  onPress,
}: CourtCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{courtName}</Text>
      <Text style={styles.subtitle}>View Games</Text>
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
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
  },
});