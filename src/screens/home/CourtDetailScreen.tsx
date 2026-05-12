import { ScrollView, StyleSheet, Text } from 'react-native';

export default function CourtDetailScreen({ route }: any) {
  const { court } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{court.court_name}</Text>
      <Text style={styles.subtitle}>Games for this court will appear here.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
});