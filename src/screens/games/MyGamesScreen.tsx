import { StyleSheet, Text, View } from 'react-native';

export default function MyGamesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Games</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});