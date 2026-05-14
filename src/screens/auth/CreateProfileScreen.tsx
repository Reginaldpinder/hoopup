import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import Screen from '../../components/Screen';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { TYPOGRAPHY } from '../../constants/typography';
import { supabase } from '../../lib/supabase';

export default function CreateProfileScreen() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreateProfile() {
    if (!username || !displayName) {
      Alert.alert('Missing information', 'Please enter a username and display name.');
      return;
    }

    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setLoading(false);
      Alert.alert('Error', 'Unable to find logged-in user.');
      return;
    }

    const { error } = await supabase.from('profiles').insert({
      id: userData.user.id,
      username: username.trim().toLowerCase(),
      display_name: displayName.trim(),
    });

    setLoading(false);

    if (error) {
      Alert.alert('Profile failed', error.message);
      return;
    }

    Alert.alert('Profile created', 'Your profile is ready.');
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/hoopup-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Create your profile</Text>
        <Text style={styles.subtitle}>Set your name so hoopers know who is pulling up.</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={COLORS.gray}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Display Name"
          placeholderTextColor={COLORS.gray}
          value={displayName}
          onChangeText={setDisplayName}
        />

        {loading ? (
          <ActivityIndicator color={COLORS.orange} style={styles.loader} />
        ) : (
          <PrimaryButton title="Save Profile" onPress={handleCreateProfile} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    backgroundColor: COLORS.black,
  },
  logo: {
    width: 190,
    height: 190,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.gray,
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.darkCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: SPACING.md,
    fontSize: 16,
  },
  loader: {
    marginTop: SPACING.md,
  },
});