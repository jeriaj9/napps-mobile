import { useRouter, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { BenefitProps } from '@/components/benefits/benefit-card';
import { TicketProps } from '@/components/tickets/ticket-card';
import { mockAllBenefits, mockEnjoyingBenefits } from '@/constants/mockBenefitsData';
import { addTicket, mockPendingRequests } from '@/constants/mockTicketsData';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function BenefitDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find the benefit details from either available or enjoying lists
  const findBenefit = (): BenefitProps | undefined => {
    const isEnrolled = mockEnjoyingBenefits.some((item) => item.id === id);
    const item = mockAllBenefits.find((b) => b.id === id);
    if (item) {
      return { ...item, isEnjoying: isEnrolled };
    }
    return mockEnjoyingBenefits.find((b) => b.id === id);
  };

  const benefitObj = findBenefit();
  const [benefit] = useState<BenefitProps | undefined>(benefitObj);

  // Check if a request is already pending for this benefit
  const hasPendingRequest = () => {
    if (!benefit) return false;
    return mockPendingRequests.some(
      (req) => req.status === 'PENDING' && req.description === benefit.title
    );
  };

  const [isRequested, setIsRequested] = useState(hasPendingRequest());

  if (!benefit) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: '#F7F8FA' }]}>
        <ScreenHeader title="Benefit Details" onBackPress={() => router.back()} />
        <View style={styles.errorContainer}>
          <SymbolView name="exclamationmark.triangle.fill" size={48} tintColor="#FF3B30" />
          <ThemedText style={styles.errorText}>Benefit not found</ThemedText>
          <Pressable style={styles.btnBack} onPress={() => router.back()}>
            <ThemedText style={styles.btnBackText}>Go Back</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleRequest = () => {
    alert(`Enrollment request for "${benefit.title}" submitted successfully!`);
    const newRequest: TicketProps = {
      id: `req-${benefit.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      status: 'PENDING',
      employee: { name: 'SAMUEL LUIS', id: 'NT-2037' },
      requestType: 'Benefit: ' + benefit.title,
      description: benefit.title,
      requestDate: 'Jun 10',
      priority: 'Medium',
    };
    addTicket(newRequest);
    setIsRequested(true);
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

  return (
    <View style={[styles.container, { backgroundColor: '#F7F8FA' }]}>
      <ScreenHeader title="Benefit Details" onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.six }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Detail Card */}
        <View style={styles.card}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.iconWrapper}>
              <SymbolView
                name={getBenefitIcon(benefit.title) as any}
                size={36}
                tintColor="#1EBD60"
              />
            </View>
            {benefit.isEnjoying ? (
              <View style={styles.activeBadge}>
                <SymbolView name="checkmark.circle.fill" size={12} tintColor="#1EBD60" />
                <ThemedText style={styles.activeText}>Enrolled</ThemedText>
              </View>
            ) : isRequested ? (
              <View style={styles.pendingBadge}>
                <SymbolView name="clock.fill" size={12} tintColor="#FFB000" />
                <ThemedText style={styles.pendingText}>Pending Review</ThemedText>
              </View>
            ) : (
              <View style={styles.inactiveBadge}>
                <ThemedText style={styles.inactiveText}>Not Enrolled</ThemedText>
              </View>
            )}
          </View>

          <ThemedText style={styles.benefitTitle}>{benefit.title}</ThemedText>
          <ThemedText style={styles.benefitDescription}>{benefit.description}</ThemedText>

          <View style={styles.divider} />

          {/* Additional details to look premium */}
          <View style={styles.detailsGrid}>
            <ThemedText style={styles.sectionTitle}>Plan Details</ThemedText>

            <View style={styles.detailItem}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>
                PROVIDER
              </ThemedText>
              <ThemedText type="smallBold" style={styles.detailValue}>
                {benefit.title.includes('Insurance') ? 'Blue Cross Blue Shield' : 'Newtech Employee Services'}
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>
                MONTHLY VALUE
              </ThemedText>
              <ThemedText type="smallBold" style={styles.detailValue}>
                {benefit.title.includes('Insurance') ? '$120.00' : '$45.00 (Company Subsidized)'}
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>
                ELIGIBILITY
              </ThemedText>
              <ThemedText type="smallBold" style={styles.detailValue}>
                Active full-time employees
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>
                COVERS
              </ThemedText>
              <ThemedText type="small" style={styles.detailValue}>
                Employee + registered dependents
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Action button */}
          {!benefit.isEnjoying && !isRequested && (
            <Pressable style={styles.btnEnroll} onPress={handleRequest}>
              <SymbolView name="plus" size={16} tintColor="#ffffff" />
              <ThemedText type="smallBold" style={styles.btnEnrollText}>
                Request Enrollment
              </ThemedText>
            </Pressable>
          )}

          {isRequested && (
            <View style={styles.requestStatusCard}>
              <SymbolView name="info.circle.fill" size={16} tintColor="#FFB000" />
              <ThemedText style={styles.requestStatusText}>
                Your enrollment request has been submitted and is currently pending review by your supervisor.
              </ThemedText>
            </View>
          )}

          {benefit.isEnjoying && (
            <View style={styles.enrolledStatusCard}>
              <SymbolView name="checkmark.seal.fill" size={16} tintColor="#1EBD60" />
              <ThemedText style={styles.enrolledStatusText}>
                You are currently enrolled in this benefit. To make changes or cancel, contact HR services.
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    paddingTop: Spacing.four,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.five,
    marginTop: 100,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
  },
  btnBack: {
    backgroundColor: '#1EBD60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnBackText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginHorizontal: Spacing.four,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeText: {
    color: '#1EBD60',
    fontSize: 12,
    fontWeight: '700',
  },
  pendingBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pendingText: {
    color: '#FFB000',
    fontSize: 12,
    fontWeight: '700',
  },
  inactiveBadge: {
    backgroundColor: '#F4F5F7',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 12,
  },
  inactiveText: {
    color: '#60646C',
    fontSize: 12,
    fontWeight: '700',
  },
  benefitTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    marginBottom: Spacing.two,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#60646C',
    lineHeight: 20,
    marginBottom: Spacing.four,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E1E6',
    marginVertical: Spacing.four,
  },
  detailsGrid: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: Spacing.one,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailValue: {
    fontSize: 13,
    color: '#000000',
  },
  btnEnroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1EBD60',
    paddingVertical: 14,
    borderRadius: 8,
    gap: Spacing.two,
  },
  btnEnrollText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  requestStatusCard: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: '#FFF9E6',
    padding: Spacing.three,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  requestStatusText: {
    flex: 1,
    fontSize: 12,
    color: '#E65100',
    lineHeight: 18,
  },
  enrolledStatusCard: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: '#E8F5E9',
    padding: Spacing.three,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  enrolledStatusText: {
    flex: 1,
    fontSize: 12,
    color: '#1B5E20',
    lineHeight: 18,
  },
});
