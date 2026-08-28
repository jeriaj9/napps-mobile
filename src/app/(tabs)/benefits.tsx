import { useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BenefitCard, BenefitProps } from '@/components/benefits/benefit-card';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  fetchEmployeeBenefits,
  mapBackendBenefitToBenefitProps,
  requestBenefit,
} from '@/services/benefitService';
import { useAuthStore } from '@/store/authStore';

type TabState = 'enjoying' | 'all';

export default function BenefitsScreen() {
  const insets = useSafeAreaInsets();
  const { accessToken, user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabState>('enjoying');
  const [benefitsList, setBenefitsList] = useState<BenefitProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadBenefits = useCallback(
    async (isRefresh = false) => {
      const employeeId = user?.id || user?.employee_id || user?.party_id;

      if (!accessToken || !employeeId) {
        setError('User not authenticated. Please log in to view benefits.');
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const rawBenefits = await fetchEmployeeBenefits(accessToken, Number(employeeId));
        const mapped = rawBenefits.map(mapBackendBenefitToBenefitProps);
        setBenefitsList(mapped);
      } catch (err: any) {
        console.error('Failed to load benefits from backend:', err);
        setError('Unable to load benefits. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [accessToken, user]
  );

  useFocusEffect(
    useCallback(() => {
      loadBenefits();
    }, [loadBenefits])
  );

  const handleRequestBenefit = async (benefit: BenefitProps) => {
    const employeeId = user?.id || user?.employee_id || user?.party_id;
    if (!accessToken || !employeeId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    try {
      await requestBenefit(accessToken, Number(benefit.id), Number(employeeId));
      Alert.alert(
        'Request Submitted',
        `Enrollment request for "${benefit.title}" has been submitted successfully!`
      );
      loadBenefits();
    } catch (err: any) {
      Alert.alert('Request Failed', err.message || 'Could not submit benefit request.');
    }
  };

  const getSubheaderText = () => {
    switch (activeTab) {
      case 'enjoying':
        return 'Here are your currently enrolled benefits.';
      case 'all':
        return 'Here are all available employee benefits.';
    }
  };

  const currentData =
    activeTab === 'enjoying'
      ? benefitsList.filter((b) => b.isEnjoying || b.status === 'active')
      : benefitsList;

  const renderContent = () => {
    if (isLoading && !isRefreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1EBD60" />
          <ThemedText style={styles.loadingText}>Loading benefits...</ThemedText>
        </View>
      );
    }

    if (error && benefitsList.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <SymbolView name="exclamationmark.triangle.fill" size={48} tintColor="#FF3B30" />
          <ThemedText style={styles.errorTitle}>Something went wrong</ThemedText>
          <ThemedText style={styles.errorMessage}>{error}</ThemedText>
          <Pressable style={styles.retryButton} onPress={() => loadBenefits()}>
            <SymbolView name="arrow.clockwise" size={16} tintColor="#ffffff" />
            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BenefitCard
            benefit={item}
            onRequest={() => handleRequestBenefit(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadBenefits(true)}
            tintColor="#1EBD60"
            colors={['#1EBD60']}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.six + 80 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <SymbolView name="gift" size={40} tintColor="#C7C7CC" />
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              {activeTab === 'enjoying'
                ? 'You are not currently enrolled in any benefits.'
                : 'No benefits available at this time.'}
            </ThemedText>
          </View>
        }
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: '#F7F8FA' }]}>
      {/* Tab bar header */}
      <View style={styles.tabsSection}>
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'enjoying' && styles.activeTab]}
            onPress={() => setActiveTab('enjoying')}>
            <ThemedText
              style={[styles.tabText, activeTab === 'enjoying' && styles.activeTabText]}>
              My Benefits
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}>
            <ThemedText
              style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Benefits
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Dynamic Subheader instruction text */}
      {!error && (
        <View style={styles.subheader}>
          <ThemedText style={styles.subheaderText}>
            {getSubheaderText()}
          </ThemedText>
        </View>
      )}

      {/* Content Area */}
      <View style={styles.contentArea}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsSection: {
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E1E6',
    zIndex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.four,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1EBD60',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#1EBD60',
    fontWeight: '700',
  },
  subheader: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  subheaderText: {
    color: '#60646C',
    fontSize: 15,
  },
  contentArea: {
    flex: 1,
  },
  listContent: {
    paddingTop: Spacing.one,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  loadingText: {
    color: '#60646C',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    paddingTop: 80,
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: '#60646C',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1EBD60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
