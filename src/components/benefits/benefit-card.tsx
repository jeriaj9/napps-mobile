import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export interface BenefitProps {
  id: string;
  title: string;
  description: string;
  thumbnailInitials?: string;
  isEnjoying?: boolean; // Used to change the actions for the 'Enjoying' tab
}

export function BenefitCard({
  benefit,
  onDelete,
  onRequest,
}: {
  benefit: BenefitProps;
  onDelete?: () => void;
  onRequest?: () => void;
}) {

  const getBenefitIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('health') || t.includes('médica') || t.includes('insurance')) {
      return 'stethoscope';
    } else if (t.includes('401') || t.includes('retirement') || t.includes('body shop')) {
      return 'creditcard';
    } else if (t.includes('wellness') || t.includes('salud')) {
      return 'heart';
    } else if (t.includes('life') || t.includes('seguro') || t.includes('vida')) {
      return 'umbrella';
    } else if (t.includes('parental') || t.includes('leave') || t.includes('aniversario') || t.includes('fripick')) {
      return 'face.smiling';
    } else if (t.includes('gym') || t.includes('membership')) {
      return 'barbell';
    } else if (t.includes('courier') || t.includes('discount')) {
      return 'tag';
    } else if (t.includes('transportation') || t.includes('transit') || t.includes('car')) {
      return 'car';
    }
    return 'gift';
  };

  const renderRightActions = () => {
    if (benefit.isEnjoying || !onDelete) return null;

    return (
      <Pressable style={styles.deleteAction} onPress={onDelete}>
        <SymbolView name="trash" size={16} tintColor="#ffffff" />
        <ThemedText style={styles.deleteActionText}>Delete</ThemedText>
      </Pressable>
    );
  };

  const cardContent = (
    <ThemedView style={styles.card} type="background">
      <View style={styles.contentRow}>
        <View style={styles.iconWrapper}>
          <SymbolView
            name={getBenefitIcon(benefit.title) as any}
            size={28}
            tintColor="#1EBD60"
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{benefit.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            {benefit.description}
          </ThemedText>
          
          {benefit.isEnjoying ? (
            <View style={styles.badgeContainer}>
              <View style={styles.activeBadge}>
                <SymbolView name="checkmark.circle.fill" size={12} tintColor="#1EBD60" />
                <ThemedText style={styles.activeText}>Enrolled</ThemedText>
              </View>
            </View>
          ) : (
            <Pressable style={styles.requestButton} onPress={onRequest}>
              <SymbolView name="plus" size={12} tintColor="#ffffff" />
              <ThemedText style={styles.requestButtonText}>Request</ThemedText>
            </Pressable>
          )}
        </View>
      </View>
    </ThemedView>
  );

  if (benefit.isEnjoying || !onDelete) {
    return cardContent;
  }

  return (
    <Swipeable renderRightActions={renderRightActions} friction={2} rightThreshold={40}>
      {cardContent}
    </Swipeable>
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
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.four,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: '#60646C',
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeText: {
    color: '#1EBD60',
    fontSize: 11,
    fontWeight: '700',
  },
  deleteAction: {
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: Spacing.three,
    marginBottom: Spacing.three,
    marginRight: Spacing.four,
    gap: 4,
  },
  deleteActionText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1EBD60',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: Spacing.two,
  },
  requestButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
