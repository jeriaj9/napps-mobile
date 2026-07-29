import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: any | null;
  isReady: boolean;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isReady: false,

  login: async (token: string, userData: any) => {
    try {
      await SecureStore.setItemAsync('access_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
      
      set({ accessToken: token, user: userData, isReady: true });
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('user_data');
      set({ accessToken: null, user: null });
    } catch (e) {
      console.error('Failed to delete auth state', e);
    }
  },

  initAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      const userStr = await SecureStore.getItemAsync('user_data');
      
      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error('Failed to parse user data from secure store');
        }
      }

      set({ accessToken: token, user, isReady: true });
    } catch (e) {
      console.error('Failed to load auth state', e);
      set({ isReady: true });
    }
  },
}));
