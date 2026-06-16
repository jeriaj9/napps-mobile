import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { BenefitCard } from '@/components/benefits/benefit-card';
import { ManagementCard } from '@/components/benefits/management-card';
import { ThemedText } from '@/components/themed-text';
import {
  mockAllBenefits,
  mockEnjoyingBenefits,
  mockManagementRequests,
} from '@/constants/mockBenefitsData';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TabState = 'enjoying' | 'all' | 'management';

export default function BenefitsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  // Set default tab to "all" based on reference images being centered there usually, but "enjoying" is fine too.
  const [activeTab, setActiveTab] = useState<TabState>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'enjoying':
        return (
          <FlatList
            data={mockEnjoyingBenefits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BenefitCard benefit={item} />}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + Spacing.six },
            ]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText themeColor="textSecondary">
                  You are not currently enjoying any benefits.
                </ThemedText>
              </View>
            }
          />
        );
      case 'all':
        return (
          <FlatList
            data={mockAllBenefits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BenefitCard benefit={item} />}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + Spacing.six },
            ]}
          />
        );
      case 'management':
        return (
          <>
            <View style={[styles.filtersContainer, { backgroundColor: theme.background }]}>
              <View
                style={[styles.dropdownContainer, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText style={{ color: theme.textSecondary }}>Pending</ThemedText>
                <SymbolView
                  name="chevron.up.chevron.down"
                  size={12}
                  tintColor={theme.textSecondary}
                />
              </View>
              <View
                style={[styles.searchInputContainer, { backgroundColor: theme.backgroundElement }]}>
                <SymbolView name="magnifyingglass" size={16} tintColor={theme.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder="Search by benefit..."
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
            <FlatList
              data={mockManagementRequests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ManagementCard request={item} />}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: insets.bottom + Spacing.six },
              ]}
            />
          </>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      {/* Header */}
      <ScreenHeader
        title="My Benefits"
        subtitle="Unlock the best of your workplace and enjoy your benefits"
        rightContent={
          <Pressable style={styles.newBenefitButton}>
            <SymbolView name="plus" size={14} tintColor="#ffffff" />
            <ThemedText type="smallBold" style={styles.newBenefitText}>
              New Benefit
            </ThemedText>
          </Pressable>
        }
      />

      {/* Sticky Tabs */}
      <View style={[styles.tabsSection, { backgroundColor: theme.backgroundElement }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'enjoying' && styles.activeTab]}
            onPress={() => setActiveTab('enjoying')}>
            <ThemedText
              type="smallBold"
              style={[styles.tabText, activeTab === 'enjoying' && { color: theme.text }]}>
              Enjoying
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}>
            <ThemedText
              type="smallBold"
              style={[styles.tabText, activeTab === 'all' && { color: theme.text }]}>
              All benefits
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'management' && styles.activeTab]}
            onPress={() => setActiveTab('management')}>
            <ThemedText
              type="smallBold"
              style={[styles.tabText, activeTab === 'management' && { color: theme.text }]}>
              Management
            </ThemedText>
          </Pressable>
        </ScrollView>
      </View>

      {/* Content Area with a lighter background to match the screenshots */}
      <View style={[styles.contentArea, { backgroundColor: theme.background }]}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1E7C9A', // Teal Gradient match
    paddingBottom: Spacing.four,
    borderBottomLeftRadius: Spacing.four,
    borderBottomRightRadius: Spacing.four,
    marginBottom: Spacing.four,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: Spacing.four,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  newBenefitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4DB6AC', // Lighter Teal Button
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    gap: Spacing.one,
  },
  newBenefitText: {
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tabsSection: {
    paddingHorizontal: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E1E6',
    zIndex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: Spacing.six,
  },
  tab: {
    paddingBottom: Spacing.two,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#15395A', // Dark underline
  },
  tabText: {
    color: '#9E9E9E', // Inactive text
  },
  contentArea: {
    flex: 1,
  },
  listContent: {
    paddingTop: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
    gap: Spacing.three,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E1E6',
    minWidth: 100,
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
});
