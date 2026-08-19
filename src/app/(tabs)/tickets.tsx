import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { TicketCard, TicketProps } from '@/components/tickets/ticket-card';
import { mockMyTickets, mockPendingRequests, updateTicketStatus } from '@/constants/mockTicketsData';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { fetchMyTickets, mapBackendTicketToTicketProps, updateBackendTicketStatus } from '@/services/ticketService';
import { useAuthStore } from '@/store/authStore';

export default function TicketsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ticketCreated } = useLocalSearchParams<{ ticketCreated?: string }>();
  const { accessToken, user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'myTickets' | 'pendingRequests'>('myTickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [myTickets, setMyTickets] = useState<TicketProps[]>(mockMyTickets);
  const [pendingRequests, setPendingRequests] = useState<TicketProps[]>(mockPendingRequests);

  const loadTickets = useCallback(async (isRefresh = false) => {
    if (!accessToken) {
      setMyTickets([...mockMyTickets]);
      setPendingRequests([...mockPendingRequests]);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log('user: ', user);
      const rawTickets = await fetchMyTickets(accessToken, user.id);
      console.log('raw tickets: ', rawTickets);

      const mapped = rawTickets.map((t) => mapBackendTicketToTicketProps(t));
      const currentUserId = user?.id || user?.employee_id;

      let my: TicketProps[] = [];
      let pending: TicketProps[] = [];

      if (currentUserId) {
        my = rawTickets
          .filter((t) => {
            const createdById = t.created_by && (typeof t.created_by === 'object' ? t.created_by.id : t.created_by);
            const ownerId = t.owner && (typeof t.owner === 'object' ? t.owner.id : t.owner);
            return createdById == currentUserId || ownerId == currentUserId;
          })
          .map((t) => mapBackendTicketToTicketProps(t));

        pending = rawTickets
          .filter((t) => {
            const assignedToId = t.assigned_to && (typeof t.assigned_to === 'object' ? t.assigned_to.id : t.assigned_to);
            const createdById = t.created_by && (typeof t.created_by === 'object' ? t.created_by.id : t.created_by);
            const ownerId = t.owner && (typeof t.owner === 'object' ? t.owner.id : t.owner);
            return assignedToId == currentUserId || (createdById != currentUserId && ownerId != currentUserId);
          })
          .map((t) => mapBackendTicketToTicketProps(t));
      } else {
        my = mapped;
        pending = mapped.filter((t) => t.status === 'PENDING' || t.status === 'OPEN');
      }

      setMyTickets(my.length > 0 ? my : mapped);
      setPendingRequests(pending.length > 0 ? pending : mapped);
    } catch (error) {
      console.error('Failed to fetch tickets from backend:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [accessToken, user]);

  useFocusEffect(
    useCallback(() => {
      loadTickets();
    }, [loadTickets])
  );

  const isMyTickets = activeTab === 'myTickets';

  const handleApprove = async (id: string) => {
    if (accessToken) {
      try {
        await updateBackendTicketStatus(accessToken, id, 'resolved', 'Approved via mobile app');
        loadTickets(true);
        return;
      } catch (e) {
        console.error('API Approve failed, falling back to local state:', e);
      }
    }
    updateTicketStatus(id, 'APPROVED');
    setPendingRequests([...mockPendingRequests]);
    setMyTickets([...mockMyTickets]);
  };

  const handleReject = async (id: string) => {
    if (accessToken) {
      try {
        await updateBackendTicketStatus(accessToken, id, 'rejected', 'Rejected via mobile app');
        loadTickets(true);
        return;
      } catch (e) {
        console.error('API Reject failed, falling back to local state:', e);
      }
    }
    updateTicketStatus(id, 'DENIED');
    setPendingRequests([...mockPendingRequests]);
    setMyTickets([...mockMyTickets]);
  };


  const getMetrics = () => {
    const list = isMyTickets ? myTickets : pendingRequests;
    const total = list.length;
    const open = list.filter(t => t.status === 'PENDING' || t.status === 'OPEN').length;
    const resolved = list.filter(t => t.status === 'APPROVED' || t.status === 'RESOLVED').length;
    const needAttention = isMyTickets
      ? list.filter(t => t.status === 'DENIED' || t.status === 'IN PROGRESS').length
      : list.filter(t => t.status === 'PENDING' || t.status === 'OPEN' || t.status === 'IN PROGRESS').length;

    return { total, open, resolved, needAttention };
  };

  const metrics = getMetrics();

  const getFilteredTickets = () => {
    const list = isMyTickets ? myTickets : pendingRequests;
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(
      t =>
        t.id.toLowerCase().includes(query) ||
        t.requestType.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query)) ||
        (t.employee && t.employee.name.toLowerCase().includes(query))
    );
  };

  const ticketsData = getFilteredTickets();


  useEffect(() => {
    if (ticketCreated === 'true') {
      loadTickets(true);
      const initTimer = setTimeout(() => {
        setShowSuccessToast(true);
      }, 0);

      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        router.setParams({ ticketCreated: undefined });
      }, 5000);

      return () => {
        clearTimeout(initTimer);
        clearTimeout(timer);
      };
    }
  }, [ticketCreated, router, loadTickets]);

  return (
    <View style={[styles.container, { backgroundColor: '#F7F8FA' }]}>
      {/* Header */}
      <ScreenHeader
        title="Tickets"
        subtitle="Manage your requests and tickets"
        rightContent={
          <Pressable style={styles.newTicketButton} onPress={() => router.push('/new-ticket')}>
            <SymbolView name="plus" size={14} tintColor="#ffffff" />
            <ThemedText type="smallBold" style={styles.newTicketText}>
              New Ticket
            </ThemedText>
          </Pressable>
        }
      />

      {/* Metrics Card */}
      <View style={styles.metricsWrapper}>
        <View style={styles.metricsCard}>
          <View style={styles.metricColumn}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.metricTitle}>
              Total
            </ThemedText>
            <ThemedText style={styles.metricValue}>
              {metrics.total}
            </ThemedText>
          </View>

          {metrics.needAttention !== undefined && (
            <>
              <View style={styles.metricDivider} />
              <View style={styles.metricColumn}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.metricTitle} numberOfLines={1} adjustsFontSizeToFit>
                  Attention
                </ThemedText>
                <ThemedText style={[styles.metricValue, { color: '#FF3B30' }]}>
                  {metrics.needAttention}
                </ThemedText>
              </View>
            </>
          )}

          <View style={styles.metricDivider} />
          <View style={styles.metricColumn}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.metricTitle}>
              Open
            </ThemedText>
            <ThemedText style={[styles.metricValue, { color: '#FF9500' }]}>
              {metrics.open}
            </ThemedText>
          </View>

          <View style={styles.metricDivider} />
          <View style={styles.metricColumn}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.metricTitle}>
              Resolved
            </ThemedText>
            <ThemedText style={[styles.metricValue, { color: '#1EBD60' }]}>
              {metrics.resolved}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Search and Tabs */}
      <View style={styles.stickySection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <SymbolView name="magnifyingglass" size={16} tintColor="#60646C" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by ID, type..."
              placeholderTextColor="#9E9E9E"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, isMyTickets && styles.activeTab]}
            onPress={() => setActiveTab('myTickets')}>
            <ThemedText
              style={[styles.tabText, isMyTickets && styles.activeTabText]}>
              My Tickets
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, !isMyTickets && styles.activeTab]}
            onPress={() => setActiveTab('pendingRequests')}>
            <ThemedText
              style={[styles.tabText, !isMyTickets && styles.activeTabText]}>
              Pending Requests
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Tickets List Container styled as a single Card */}
      <View style={styles.listWrapper}>
        <FlatList
          data={ticketsData}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadTickets(true)}
              tintColor="#1EBD60"
            />
          }
          renderItem={({ item }) => (
            <TicketCard
              ticket={item}
              onApprove={!isMyTickets ? () => handleApprove(item.id) : undefined}
              onReject={!isMyTickets ? () => handleReject(item.id) : undefined}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          style={styles.flatListCard}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.six + 80 }]}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Success Toast */}
      {showSuccessToast && (
        <View style={[styles.toastContainer, { bottom: insets.bottom + Spacing.four }]}>
          <View style={styles.toastContent}>
            <SymbolView name="checkmark.circle.fill" size={20} tintColor="#1EBD60" />
            <View style={styles.toastTextContainer}>
              <ThemedText type="smallBold" style={{ fontSize: 13, color: '#000000' }}>
                Ticket Created!
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 11, marginTop: 2 }}>
                Your ticket request has been successfully submitted for review.
              </ThemedText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1EBD60',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    gap: Spacing.one,
  },
  newTicketText: {
    color: '#ffffff',
  },
  metricsWrapper: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  metricsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#ffffff',
    paddingVertical: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  metricColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.one,
  },
  metricDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    backgroundColor: '#E0E1E6',
  },
  metricTitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: Spacing.one,
    color: '#8E8E93',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000000',
  },
  stickySection: {
    paddingHorizontal: Spacing.four,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#ffffff',
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    height: 24,
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: Spacing.six,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E1E6',
    paddingBottom: 0,
    marginBottom: Spacing.three,
  },
  tab: {
    paddingBottom: Spacing.two,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1EBD60',
  },
  tabText: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1EBD60',
    fontWeight: '700',
  },
  listWrapper: {
    flex: 1,
  },
  flatListCard: {
    flex: 1,
    marginHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  listContent: {
    paddingTop: 0,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E1E6',
    marginLeft: Spacing.four + 44 + Spacing.three, // Align with description text (margin + icon + gap)
  },
  toastContainer: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    alignItems: 'center',
    zIndex: 999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    width: '100%',
    maxWidth: 400,
    gap: Spacing.three,
  },
  toastTextContainer: {
    flex: 1,
  },
});
