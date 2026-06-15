import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

interface ProfileCardProps {
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
}

export function ProfileCard({ title, headerRight, children }: ProfileCardProps) {
  return (
    <ThemedView type="background" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="default" style={styles.title}>
          {title}
        </ThemedText>
        {headerRight && <View>{headerRight}</View>}
      </View>
      <View style={styles.content}>{children}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E1E6', // Fallback for border color, ideally themed
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F3',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    paddingTop: Spacing.three,
  },
});
