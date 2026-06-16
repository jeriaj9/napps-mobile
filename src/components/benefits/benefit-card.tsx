import { SymbolView } from 'expo-symbols';
import { StyleSheet, View, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface BenefitProps {
  id: string;
  title: string;
  description: string;
  thumbnailInitials?: string;
  isEnjoying?: boolean; // Used to change the actions for the 'Enjoying' tab
}

export function BenefitCard({ benefit }: { benefit: BenefitProps }) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.card} type="background">
      <View style={styles.contentRow}>
        <View style={[styles.thumbnail, { backgroundColor: '#1E7C9A' }]}>
          <ThemedText style={styles.thumbnailText}>{benefit.thumbnailInitials || 'BE'}</ThemedText>
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{benefit.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            {benefit.description}
          </ThemedText>
          <Pressable style={styles.learnMore}>
            <ThemedText type="small" style={styles.learnMoreText}>
              Learn more{' '}
            </ThemedText>
            <SymbolView name="arrow.right" size={10} tintColor={theme.textSecondary} />
          </Pressable>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        {benefit.isEnjoying ? (
          <View style={styles.activeBadge}>
            <ThemedText style={styles.activeText}>Active</ThemedText>
          </View>
        ) : (
          <>
            <Pressable style={styles.actionButton}>
              <SymbolView name="pencil" size={14} tintColor="#1976D2" />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <SymbolView name="trash" size={14} tintColor="#D32F2F" />
            </Pressable>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.four,
    marginBottom: Spacing.three,
    marginHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E1E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.three,
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    marginBottom: Spacing.one,
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    color: '#60646C',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
    paddingLeft: Spacing.two,
  },
  actionButton: {
    padding: Spacing.two,
    backgroundColor: '#F0F0F3',
    borderRadius: Spacing.one,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: '#388E3C',
    fontSize: 10,
    fontWeight: '700',
  },
});
