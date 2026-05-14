import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Screen from '../../components/Screen';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { TYPOGRAPHY } from '../../constants/typography';

type WelcomeScreenProps = {
  navigation: any;
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <Screen>
        <View style={styles.logoBlock}>
          <Image
            source={require('../../../assets/images/hoopup-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.heroCopy}>
          <Text style={styles.headline}>Basketball.</Text>
          <Text style={[styles.headline, styles.orangeText]}>Together.</Text>

          <Text style={styles.subtitle}>
            Find pickup games, meet hoopers, and run it back.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Get Started"
            onPress={() => navigation.navigate('SignUp')}
          />

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Log In</Text>
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
    backgroundColor: '#0D1117',
  },
  logoBlock: {
    marginBottom: SPACING.xl,
  },
  logoImage: {
    width: 260,
    height: 260,
    alignSelf: 'center',
  },
  heroCopy: {
    marginTop: -20,
    marginBottom: SPACING.xl,
  },
  headline: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    lineHeight: 42,
  },
  orangeText: {
    color: COLORS.orange,
  },
  subtitle: {
    marginTop: SPACING.md,
    color: COLORS.gray,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 340,
  },
  actions: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 16,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontWeight: '900',
  },
});