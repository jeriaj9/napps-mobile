import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export interface BenefitProps {
  id: string;
  title: string;
  details: string;
  imageUrl?: string;
  minTimeAtCompany: string;
  maxUsageDurationMonths: number | string;
  maxUsageCount: number | string;
  description?: string;
  thumbnailInitials?: string;
  isEnjoying?: boolean;
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
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/benefit-detail',
      params: { id: benefit.id },
    });
  };

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

  const formattedDuration = typeof benefit.maxUsageDurationMonths === 'number'
    ? `${benefit.maxUsageDurationMonths} mo`
    : benefit.maxUsageDurationMonths;

  const formattedMaxCount = typeof benefit.maxUsageCount === 'number'
    ? `${benefit.maxUsageCount} ${benefit.maxUsageCount === 1 ? 'time' : 'times'}`
    : benefit.maxUsageCount;

  const cardContent = (
    <Pressable onPress={handlePress}>
      <ThemedView style={styles.card} type="background">
        <View style={styles.contentRow}>
          {benefit.imageUrl ? (
            <Image source={{ uri: benefit.imageUrl }} style={styles.imageWrapper} resizeMode="cover" />
          ) : (
            <View style={styles.iconWrapper}>
              <SymbolView
                name={getBenefitIcon(benefit.title) as any}
                size={28}
                tintColor="#1EBD60"
              />
            </View>
          )}
          <View style={styles.textContainer}>
            <ThemedText style={styles.title}>{benefit.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.description} numberOfLines={2}>
              {benefit.details || benefit.description}
            </ThemedText>

            {/* Quick Metadata Row */}
            <View style={styles.metaRow}>
              <View style={styles.metaBadge}>
                <SymbolView name="clock" size={10} tintColor="#60646C" />
                <ThemedText style={styles.metaBadgeText}>Min: {benefit.minTimeAtCompany}</ThemedText>
              </View>
              <View style={styles.metaBadge}>
                <SymbolView name="calendar" size={10} tintColor="#60646C" />
                <ThemedText style={styles.metaBadgeText}>Dur: {formattedDuration}</ThemedText>
              </View>
              <View style={styles.metaBadge}>
                <SymbolView name="number" size={10} tintColor="#60646C" />
                <ThemedText style={styles.metaBadgeText}>Limit: {formattedMaxCount}</ThemedText>
              </View>
            </View>
            
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
    </Pressable>
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
  imageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
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
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 4,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 10,
    color: '#4B4D52',
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
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
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: Spacing.one,
  },
  requestButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});

