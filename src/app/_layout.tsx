import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const { isReady, accessToken, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'login';

    if (!accessToken && !inAuthGroup) {
      // Redirect to the login page if not authenticated
      router.replace('/login');
    } else if (accessToken && inAuthGroup) {
      // Redirect to the tabs if already authenticated and trying to access login
      router.replace('/(tabs)');
    }
  }, [isReady, accessToken, segments, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="new-ticket" options={{ headerShown: false }} />
          <Stack.Screen name="ticket-detail" options={{ headerShown: false }} />
          <Stack.Screen name="benefit-detail" options={{ headerShown: false }} />
          <Stack.Screen name="add-skill" options={{ headerShown: false }} />
          <Stack.Screen name="add-interest" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
