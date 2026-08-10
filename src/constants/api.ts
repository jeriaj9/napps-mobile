import { Platform } from 'react-native';

export const API_BASE =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api/timesheet'
    : 'http://localhost:3000/api/timesheet';

export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});
