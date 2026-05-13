import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.orange,
    padding: 16,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#4B5563',
  },
  text: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 16,
  },
});