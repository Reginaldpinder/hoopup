import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
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

type SignUpScreenProps = {
  navigation: any;
};

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing information', 'Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Sign up failed', error.message);
      return;
    }

    Alert.alert('Account created', 'Now log in to continue.');
    navigation.navigate('Login');
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/hoopup-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join the run and find your next game.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.gray}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.gray}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={COLORS.gray}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {loading ? (
          <ActivityIndicator color={COLORS.orange} style={styles.loader} />
        ) : (
          <PrimaryButton title="Create Account" onPress={handleSignUp} />
        )}

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.orangeText}>Log in</Text>
          </Text>
        </Pressable>
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
  linkText: {
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontWeight: '700',
  },
  orangeText: {
    color: COLORS.orange,
  },
});