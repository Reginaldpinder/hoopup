import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { supabase } from '../../lib/supabase';

export default function CreateGameScreen({ route, navigation }: any) {
  const { court } = route.params;

  const [title, setTitle] = useState('Pickup Game');
  const [notes, setNotes] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('10');

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [isPaid, setIsPaid] = useState(false);
  const [pricePerPlayer, setPricePerPlayer] = useState('');

  const [loading, setLoading] = useState(false);

    async function handleCreateGame() {
    console.log('handleCreateGame started');

    if (!title || !startTime || !endTime || !maxPlayers) {
        Alert.alert('Missing fields', 'Please complete all required fields.');
        return;
    }

    if (isPaid && !pricePerPlayer) {
        Alert.alert('Missing price', 'Please enter a price per player.');
        return;
    }

    setLoading(true);

    const {
        data: { session },
        } = await supabase.auth.getSession();


        const user = session?.user;

        if (!user) {
        setLoading(false);
        return;
        }

    const payload = {
        court_id: court.id,
        host_id: user.id,
        title,
        notes,
        start_time: startTime,
        end_time: endTime,
        max_players: Number(maxPlayers),
        is_paid: isPaid,
        price_per_player: isPaid ? Number(pricePerPlayer) : null,
    };


    const { data, error } = await supabase
        .from('games')
        .insert(payload)
        .select()
        .single();

    setLoading(false);


    if (error) {
        return;
    }

    navigation.goBack();
    }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Game</Text>

      <Text style={styles.label}>Court</Text>
      <Text style={styles.courtName}>{court.court_name}</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Text style={styles.label}>Start Time</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-05-20T19:00:00Z"
        value={startTime}
        onChangeText={setStartTime}
      />

      <Text style={styles.label}>End Time</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-05-20T20:00:00Z"
        value={endTime}
        onChangeText={setEndTime}
      />

      <Text style={styles.label}>Max Players</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={maxPlayers}
        onChangeText={setMaxPlayers}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Paid Game</Text>

        <Switch
          value={isPaid}
          onValueChange={setIsPaid}
        />
      </View>

      {isPaid && (
        <>
          <Text style={styles.label}>Price Per Player</Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pricePerPlayer}
            onChangeText={setPricePerPlayer}
          />
        </>
      )}

        <Pressable
        style={styles.button}
        onPress={handleCreateGame}
        disabled={loading}
        >
        <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Create Game'}
        </Text>
        </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
    marginTop: 12,
  },
  label: {
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },
  courtName: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#111827',
    padding: 18,
    borderRadius: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});