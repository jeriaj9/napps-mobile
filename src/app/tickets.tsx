import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MetricCard } from '@/components/tickets/metric-card';
import { TicketCard } from '@/components/tickets/ticket-card';
import { mockMetrics, mockMyTickets, mockPendingRequests } from '@/constants/mockTicketsData';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TicketsScreen() {
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
      <View style={[styles.header, { paddingTop: insets.top + Spacing.four }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              Ticket System
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>One click, one ticket, one solution</ThemedText>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.newTicketButton}>
              <SymbolView name="plus" size={14} tintColor="#ffffff" />
              <ThemedText type="smallBold" style={styles.newTicketText}>
                New Ticket
              </ThemedText>
            </Pressable>
            <Pressable style={styles.settingsButton}>
              <SymbolView name="gearshape" size={18} tintColor="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Metrics Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsContainer}>
          <MetricCard title="Total" value={metrics.total} />
          {metrics.needAttention && (
            <MetricCard title="Need Attention" value={metrics.needAttention} highlightColor="#D32F2F" />
          )}
          <MetricCard
            title="Open"
            value={metrics.open}
            highlightColor="#1976D2"
            backgroundColor="#E3F2FD"
          />
          <MetricCard title="Resolved" value={metrics.resolved} highlightColor="#388E3C" />
        </ScrollView>
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
  metricsContainer: {
    paddingHorizontal: Spacing.four,
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
