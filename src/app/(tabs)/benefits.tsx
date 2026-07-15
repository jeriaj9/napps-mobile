import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BenefitCard, BenefitProps } from '@/components/benefits/benefit-card';
import { ThemedText } from '@/components/themed-text';
import { TicketProps } from '@/components/tickets/ticket-card';
import {
  mockAllBenefits,
  mockEnjoyingBenefits,
} from '@/constants/mockBenefitsData';
import { addTicket } from '@/constants/mockTicketsData';
import { MaxContentWidth, Spacing } from '@/constants/theme';

type TabState = 'enjoying' | 'all';

function generateBenefitRequestId(benefitName: string) {
  return `req-${benefitName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
}

export default function BenefitsScreen() {
  const insets = useSafeAreaInsets();
  
  // 'enjoying' corresponds to "My Benefits" in the screenshot
  const [activeTab, setActiveTab] = useState<TabState>('enjoying');
  const [allBenefits, setAllBenefits] = useState<BenefitProps[]>(mockAllBenefits);

  const handleDeleteBenefit = (id: string) => {
    setAllBenefits(allBenefits.filter((benefit) => benefit.id !== id));
  };

  const handleRequestBenefit = (benefitName: string) => {
    alert(`Enrollment request for "${benefitName}" submitted successfully!`);
    const newRequest: TicketProps = {
      id: generateBenefitRequestId(benefitName),
      status: 'PENDING',
      employee: { name: 'SAMUEL LUIS', id: 'NT-2037' },
      requestType: 'Benefit: ' + benefitName,
      description: benefitName,
      requestDate: 'Jun 10',
      priority: 'Medium',
    };
    addTicket(newRequest);
  };

  const getSubheaderText = () => {
    switch (activeTab) {
      case 'enjoying':
        return 'Here are your currently enrolled benefits.';
      case 'all':
        return 'Here are all available employee benefits.';
    }
  };

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
              { paddingBottom: insets.bottom + Spacing.six + 80 }, // extra space for tab bar and floating button
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
            data={allBenefits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BenefitCard
                benefit={item}
                onDelete={() => handleDeleteBenefit(item.id)}
                onRequest={() => handleRequestBenefit(item.title)}
              />
            )}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + Spacing.six + 80 },
            ]}
          />
        );
    }
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
      <View style={styles.subheader}>
        <ThemedText style={styles.subheaderText}>
          {getSubheaderText()}
        </ThemedText>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {renderContent()}
      </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
});

