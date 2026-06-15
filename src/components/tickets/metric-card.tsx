import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface MetricCardProps {
  title: string;
  value: string | number;
  highlightColor?: string;
  backgroundColor?: string;
}

export function MetricCard({ title, value, highlightColor, backgroundColor }: MetricCardProps) {
  const theme = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: backgroundColor || theme.backgroundElement }]}>
      <ThemedText type="small" themeColor="textSecondary">{title}</ThemedText>
      <ThemedText style={[styles.value, highlightColor ? { color: highlightColor } : { color: theme.text }]}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E1E6',
    minWidth: 110,
    marginRight: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
});
