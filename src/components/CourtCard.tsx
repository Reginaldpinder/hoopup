import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { TYPOGRAPHY } from '../constants/typography';

type CourtCardProps = {
  courtName: string;
  onPress?: () => void;
};

export default function CourtCard({ courtName, onPress }: CourtCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.eyebrow}>Indoor Court</Text>
        <Text style={styles.title}>{courtName}</Text>
        <Text style={styles.subtitle}>View active games and upcoming runs</Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>OPEN</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 105,
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: COLORS.orange,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 106, 0, 0.14)',
    borderColor: COLORS.orange,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xl,
    marginTop: SPACING.lg,
  },
  badgeText: {
    color: COLORS.orange,
    fontWeight: '900',
    fontSize: 12,
  },
});