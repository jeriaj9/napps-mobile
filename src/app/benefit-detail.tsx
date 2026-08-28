import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BenefitProps } from '@/components/benefits/benefit-card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  fetchEmployeeBenefits,
  mapBackendBenefitToBenefitProps,
  requestBenefit,
} from '@/services/benefitService';
import { useAuthStore } from '@/store/authStore';

export default function BenefitDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { accessToken, user } = useAuthStore();

  const [benefit, setBenefit] = useState<BenefitProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadBenefitDetail = useCallback(async () => {
    const employeeId = user?.id || user?.employee_id || user?.party_id;

    if (!accessToken || !employeeId) {
      setError('User not authenticated. Please log in.');
      setIsLoading(false);
      return;
    }

    if (!id) {
      setError('Benefit ID not specified.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allBenefits = await fetchEmployeeBenefits(accessToken, Number(employeeId));
      const foundBackend = allBenefits.find((b) => String(b.id) === String(id));

      if (foundBackend) {
        setBenefit(mapBackendBenefitToBenefitProps(foundBackend));
      } else {
        setError('Benefit not found or unavailable.');
      }
    } catch (err: any) {
      console.error(`Error loading benefit detail ${id}:`, err);
      setError('Unable to load benefit details. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, user, id]);

  useEffect(() => {
    loadBenefitDetail();
  }, [loadBenefitDetail]);

  const handleRequest = async () => {
    if (!benefit || !id) return;
    const employeeId = user?.id || user?.employee_id || user?.party_id;

    if (!accessToken || !employeeId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestBenefit(accessToken, Number(id), Number(employeeId));
      Alert.alert(
        'Request Submitted',
        `Enrollment request for "${benefit.title}" submitted successfully!`
      );
      loadBenefitDetail();
    } catch (err: any) {
      Alert.alert('Request Failed', err.message || 'Could not submit benefit request.');
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: '#F7F8FA' }]}>
        <ScreenHeader title="Benefit Details" onBackPress={() => router.back()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1EBD60" />
          <ThemedText style={styles.loadingText}>Loading benefit details...</ThemedText>
        </View>
      </View>
    );
  }

  if (error || !benefit) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: '#F7F8FA' }]}>
        <ScreenHeader title="Benefit Details" onBackPress={() => router.back()} />
        <View style={styles.errorContainer}>
          <SymbolView name="exclamationmark.triangle.fill" size={48} tintColor="#FF3B30" />
          <ThemedText style={styles.errorTitle}>Error Loading Benefit</ThemedText>
          <ThemedText style={styles.errorMessage}>{error || 'Benefit not found'}</ThemedText>
          <Pressable style={styles.btnBack} onPress={() => router.back()}>
            <ThemedText style={styles.btnBackText}>Go Back</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  const isEnrolled = benefit.isEnjoying || benefit.status === 'active';
  const isPending = benefit.status === 'pending';
  const isLocked = benefit.status === 'locked';

  const durationText = typeof benefit.maxUsageDurationMonths === 'number'
    ? `${benefit.maxUsageDurationMonths} months`
    : benefit.maxUsageDurationMonths;

  const countText = typeof benefit.maxUsageCount === 'number'
    ? `${benefit.maxUsageCount} ${benefit.maxUsageCount === 1 ? 'time per employee' : 'times per employee'}`
    : benefit.maxUsageCount;

  return (
    <View style={[styles.container, { backgroundColor: '#F7F8FA' }]}>
      <ScreenHeader title="Benefit Details" onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.six }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Detail Card */}
        <View style={styles.card}>
          {/* Image Banner / Thumbnail */}
          {benefit.imageUrl ? (
            <View style={styles.imageBannerContainer}>
              <Image source={{ uri: benefit.imageUrl }} style={styles.imageBanner} resizeMode="cover" />
            </View>
          ) : null}

          {/* Header Row */}
          <View style={styles.headerRow}>
            {!benefit.imageUrl && (
              <View style={styles.iconWrapper}>
                <SymbolView
                  name={getBenefitIcon(benefit.title) as any}
                  size={36}
                  tintColor="#1EBD60"
                />
              </View>
            )}
            {isEnrolled ? (
              <View style={styles.activeBadge}>
                <SymbolView name="checkmark.circle.fill" size={12} tintColor="#1EBD60" />
                <ThemedText style={styles.activeText}>Enrolled</ThemedText>
              </View>
            ) : isPending ? (
              <View style={styles.pendingBadge}>
                <SymbolView name="clock.fill" size={12} tintColor="#FFB000" />
                <ThemedText style={styles.pendingText}>Pending Review</ThemedText>
              </View>
            ) : isLocked ? (
              <View style={styles.lockedBadge}>
                <SymbolView name="lock.fill" size={12} tintColor="#8E8E93" />
                <ThemedText style={styles.lockedText}>Locked</ThemedText>
              </View>
            ) : (
              <View style={styles.inactiveBadge}>
                <ThemedText style={styles.inactiveText}>Not Enrolled</ThemedText>
              </View>
            )}
          </View>

          <ThemedText style={styles.benefitTitle}>{benefit.title}</ThemedText>
          <ThemedText style={styles.benefitDescription}>{benefit.details || benefit.description}</ThemedText>

          <View style={styles.divider} />

          {/* Structured Eligibility & Usage Grid */}
          <View style={styles.detailsGrid}>
            <ThemedText style={styles.sectionTitle}>Eligibility & Usage Limits</ThemedText>

            <View style={styles.detailItem}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>
                MINIMUM TIME AT COMPANY
              </ThemedText>
              <ThemedText type="smallBold" style={styles.detailValue}>
                {benefit.minTimeAtCompany}
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>
                MAX USAGE DURATION
              </ThemedText>
              <ThemedText type="smallBold" style={styles.detailValue}>
                {durationText}
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>
                MAX USAGE COUNT
              </ThemedText>
              <ThemedText type="smallBold" style={styles.detailValue}>
                {countText}
              </ThemedText>
            </View>

            <View style={styles.detailItem}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.detailLabel}>
                PROVIDER / ADMIN
              </ThemedText>
              <ThemedText type="smallBold" style={styles.detailValue}>
                Newtech HR & Benefits
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Action button & Status Cards */}
          {!isEnrolled && !isPending && !isLocked && (
            <Pressable
              style={[styles.btnEnroll, isSubmitting && styles.btnDisabled]}
              onPress={handleRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <SymbolView name="plus" size={16} tintColor="#ffffff" />
                  <ThemedText type="smallBold" style={styles.btnEnrollText}>
                    Request Enrollment
                  </ThemedText>
                </>
              )}
            </Pressable>
          )}

          {isPending && (
            <View style={styles.requestStatusCard}>
              <SymbolView name="info.circle.fill" size={16} tintColor="#FFB000" />
              <ThemedText style={styles.requestStatusText}>
                Your enrollment request has been submitted and is currently pending review by HR.
              </ThemedText>
            </View>
          )}

          {isLocked && (
            <View style={styles.lockedStatusCard}>
              <SymbolView name="lock.fill" size={16} tintColor="#8E8E93" />
              <ThemedText style={styles.lockedStatusText}>
                {benefit.lockReason ||
                  `You do not currently meet the minimum tenure requirement (${benefit.minTimeAtCompany}) to enroll in this benefit.`}
              </ThemedText>
            </View>
          )}

          {isEnrolled && (
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.five,
    marginTop: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#60646C',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.five,
    marginTop: 60,
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  errorMessage: {
    fontSize: 14,
    color: '#60646C',
    textAlign: 'center',
    lineHeight: 20,
  },
  btnBack: {
    backgroundColor: '#1EBD60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
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
    overflow: 'hidden',
  },
  imageBannerContainer: {
    marginHorizontal: -Spacing.four,
    marginTop: -Spacing.four,
    marginBottom: Spacing.four,
    height: 160,
    backgroundColor: '#E8F5E9',
  },
  imageBanner: {
    width: '100%',
    height: '100%',
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
  lockedBadge: {
    backgroundColor: '#F4F5F7',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lockedText: {
    color: '#8E8E93',
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
  btnDisabled: {
    opacity: 0.6,
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
  lockedStatusCard: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: '#F4F5F7',
    padding: Spacing.three,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  lockedStatusText: {
    flex: 1,
    fontSize: 12,
    color: '#616161',
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
