import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { TicketCard } from '@/components/tickets/ticket-card';
import { mockMetrics, mockMyTickets, mockPendingRequests } from '@/constants/mockTicketsData';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TicketsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'myTickets' | 'pendingRequests'>('myTickets');
  const [searchQuery, setSearchQuery] = useState('');

  const isMyTickets = activeTab === 'myTickets';
  const metrics = isMyTickets ? mockMetrics.myTickets : mockMetrics.pendingRequests;
  const ticketsData = isMyTickets ? mockMyTickets : mockPendingRequests;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      {/* Header */}
      <ScreenHeader
        title="Ticket System"
        subtitle="One click, one ticket, one solution"
        rightContent={
          <View style={styles.headerActions}>
            <Pressable style={styles.newTicketButton} onPress={() => router.push('/new-ticket')}>
              <SymbolView name="plus" size={14} tintColor="#ffffff" />
              <ThemedText type="smallBold" style={styles.newTicketText}>
                New Ticket
              </ThemedText>
            </Pressable>
          </View>
        }
      />

      {/* Metrics Card */}
      <View style={styles.metricsWrapper}>
        <View style={[styles.metricsCard, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
          <View style={styles.metricColumn}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.metricTitle}>
              Total
            </ThemedText>
            <ThemedText style={[styles.metricValue, { color: theme.text }]}>
              {metrics.total}
            </ThemedText>
          </View>

          {metrics.needAttention !== undefined && (
            <>
              <View style={[styles.metricDivider, { backgroundColor: theme.backgroundSelected }]} />
              <View style={styles.metricColumn}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.metricTitle} numberOfLines={1} adjustsFontSizeToFit>
                  Need Attention
                </ThemedText>
                <ThemedText style={[styles.metricValue, { color: '#D32F2F' }]}>
                  {metrics.needAttention}
                </ThemedText>
              </View>
            </>
          )}

          <View style={[styles.metricDivider, { backgroundColor: theme.backgroundSelected }]} />
          <View style={styles.metricColumn}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.metricTitle}>
              Open
            </ThemedText>
            <ThemedText style={[styles.metricValue, { color: '#1976D2' }]}>
              {metrics.open}
            </ThemedText>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: theme.backgroundSelected }]} />
          <View style={styles.metricColumn}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.metricTitle}>
              Resolved
            </ThemedText>
            <ThemedText style={[styles.metricValue, { color: '#388E3C' }]}>
              {metrics.resolved}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Sticky Content: Search and Tabs */}
      <View style={[styles.stickySection, { backgroundColor: theme.background }]}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: theme.backgroundElement }]}>
            <SymbolView name="magnifyingglass" size={16} tintColor={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search by ID, type, employee and more..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Pressable style={styles.filterButton}>
            <SymbolView name="line.3.horizontal.decrease.circle" size={24} tintColor={theme.text} />
          </Pressable>
        </View>

        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, isMyTickets && styles.activeTab]}
            onPress={() => setActiveTab('myTickets')}>
            <ThemedText
              type="smallBold"
              style={[styles.tabText, isMyTickets && { color: theme.text }]}>
              My Tickets
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, !isMyTickets && styles.activeTab]}
            onPress={() => setActiveTab('pendingRequests')}>
            <ThemedText
              type="smallBold"
              style={[styles.tabText, !isMyTickets && { color: theme.text }]}>
              Pending Requests
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={ticketsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TicketCard ticket={item} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.six }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#15395A', // Dark Navy from design
    paddingBottom: Spacing.four,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.five,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  newTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26A69A', // Teal button
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    gap: Spacing.one,
  },
  newTicketText: {
    color: '#ffffff',
  },
  settingsButton: {
    padding: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: Spacing.one,
  },
  metricsWrapper: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  metricsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
  },
  metricTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  stickySection: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E1E6',
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E1E6',
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    height: 24,
    fontSize: 14,
  },
  filterButton: {
    padding: Spacing.one,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  tab: {
    paddingBottom: Spacing.two,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#15395A', // Underline color
  },
  tabText: {
    color: '#9E9E9E', // Inactive text
  },
  listContent: {
    paddingTop: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
});
