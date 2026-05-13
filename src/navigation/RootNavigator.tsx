import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { COLORS } from '../constants/theme';
import { supabase } from '../lib/supabase';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const HoopUpTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.black,
    card: COLORS.black,
    text: COLORS.white,
    border: COLORS.border,
    primary: COLORS.orange,
  },
};

export default function RootNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer theme={HoopUpTheme}>
      {session ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}