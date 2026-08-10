import * as Notifications from 'expo-notifications';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { TicketProps } from '@/components/tickets/ticket-card';
import { mockMyTickets, mockPendingRequests, updateTicketStatus } from '@/constants/mockTicketsData';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { fetchTicketById, updateBackendTicketStatus } from '@/services/ticketService';
import { useAuthStore } from '@/store/authStore';

export default function TicketDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { accessToken } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketProps | undefined>(() => {
    return mockMyTickets.find((item) => item.id === id) ||
      mockPendingRequests.find((item) => item.id === id);
  });

  useEffect(() => {
    let isMounted = true;
    async function loadTicketDetail() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      if (accessToken) {
        try {
          const apiTicket = await fetchTicketById(accessToken, id);
          if (isMounted && apiTicket) {
            setTicket(apiTicket);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error('Failed to load ticket detail from API:', err);
        }
      }

      if (isMounted) {
        // Fallback to local mock ticket if API fails or token is missing
        const local = mockMyTickets.find((item) => item.id === id) ||
          mockPendingRequests.find((item) => item.id === id);
        if (local) setTicket(local);
        setIsLoading(false);
      }
    }

    loadTicketDetail();

    return () => {
      isMounted = false;
    };
  }, [id, accessToken]);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: '#F7F8FA', justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1EBD60" />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: '#F7F8FA' }]}>
        <ScreenHeader title="Ticket Details" onBackPress={() => router.back()} />
        <View style={styles.errorContainer}>
          <SymbolView name="exclamationmark.triangle.fill" size={48} tintColor="#FF3B30" />
          <ThemedText style={styles.errorText}>Ticket not found</ThemedText>
          <Pressable style={styles.btnBack} onPress={() => router.back()}>
            <ThemedText style={styles.btnBackText}>Go Back</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleApprove = async () => {
    if (accessToken) {
      try {
        await updateBackendTicketStatus(accessToken, ticket.id, 'resolved', 'Approved via detail view');
      } catch (e) {
        console.error('API approve failed in detail view:', e);
      }
    }
    updateTicketStatus(ticket.id, 'APPROVED');
    setTicket((prev) => (prev ? { ...prev, status: 'APPROVED' } : undefined));

    try {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (status !== 'granted') {
        const { status: askStatus } = await Notifications.requestPermissionsAsync();
        finalStatus = askStatus;
      }

      if (finalStatus === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Ticket Approved! 🎟️🎉',
            body: `Your request "${ticket.requestType}" (${ticket.description || 'Request'}) has been approved by your supervisor.`,
            sound: true,
          },
          trigger: null,
        });
      }
    } catch (e) {
      console.log('Notification error:', e);
    }
  };

  const handleReject = async () => {
    if (accessToken) {
      try {
        await updateBackendTicketStatus(accessToken, ticket.id, 'rejected', 'Rejected via detail view');
      } catch (e) {
        console.error('API reject failed in detail view:', e);
      }
    }
    updateTicketStatus(ticket.id, 'DENIED');
    setTicket(prev => prev ? { ...prev, status: 'DENIED' } : undefined);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'RESOLVED':
        return '#1EBD60';
      case 'PENDING':
      case 'OPEN':
        return '#FFB000';
      case 'DENIED':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'RESOLVED':
        return '#E8F5E9';
      case 'PENDING':
      case 'OPEN':
        return '#FFF9E6';
      case 'DENIED':
        return '#FFEBEE';
      default:
        return '#F4F5F7';
    }
  };

  const getTicketIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('vacation')) {
      return 'beach.umbrella.fill';
    } else if (t.includes('sick') || t.includes('licence')) {
      return 'cross.case.fill';
    } else if (t.includes('overtime')) {
      return 'clock.fill';
    } else if (t.includes('letter') || t.includes('carta')) {
      return 'doc.text.fill';
    } else if (t.includes('benefit')) {
      return 'gift.fill';
    }
    return 'doc.text.fill';
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F7F8FA' }]}>
      <ScreenHeader title="Ticket Details" onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.six }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Detail Card */}
        <View style={styles.card}>
          {/* Header row with Icon and status */}
          <View style={styles.headerRow}>
            <View style={[styles.iconWrapper, { backgroundColor: getStatusBgColor(ticket.status) }]}>
              <SymbolView
                name={getTicketIcon(ticket.requestType) as any}
                size={32}
                tintColor={getStatusColor(ticket.status)}
              />
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(ticket.status) }]}>
              <ThemedText style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                {ticket.status}
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Ticket Information */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
                REQUEST TYPE
              </ThemedText>
              <ThemedText type="smallBold" style={styles.infoValue}>
                {ticket.requestType}
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
                CREATED AT
              </ThemedText>
              <ThemedText type="small" style={styles.infoValue}>
                {ticket.createdAt || ticket.requestDate}
              </ThemedText>
            </View>

            {ticket.createdBy && (
              <View style={styles.infoRow}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
                  CREATED BY
                </ThemedText>
                <ThemedText type="small" style={styles.infoValue}>
                  {`${ticket.createdBy.name} (${ticket.createdBy.id})`}
                </ThemedText>
              </View>
            )}

            {ticket.assignedTo && (
              <View style={styles.infoRow}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
                  ASSIGNED TO
                </ThemedText>
                <ThemedText type="small" style={styles.infoValue}>
                  {`${ticket.assignedTo.name} (${ticket.assignedTo.id})`}
                </ThemedText>
              </View>
            )}

            <View style={styles.infoRow}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
                PRIORITY
              </ThemedText>
              <ThemedText type="smallBold" style={[styles.infoValue, { color: ticket.priority === 'High' ? '#FF3B30' : '#000000' }]}>
                {ticket.priority}
              </ThemedText>
            </View>

            {/* Dynamic Custom Fields (e.g. Dirigido a, Details, Format, etc.) */}
            {ticket.customFields && Object.keys(ticket.customFields).length > 0 && (
              <>
                {Object.entries(ticket.customFields).map(([key, value]) => (
                  <View style={styles.infoRow} key={key}>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
                      {key.toUpperCase()}
                    </ThemedText>
                    <ThemedText type="smallBold" style={styles.infoValue}>
                      {String(value)}
                    </ThemedText>
                  </View>
                ))}
              </>
            )}
          </View>

          <View style={styles.divider} />

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
              DESCRIPTION
            </ThemedText>
            <ThemedText style={styles.descriptionText}>
              {ticket.description || 'No additional description provided.'}
            </ThemedText>
          </View>

          {/* Action buttons inside detail view */}
          {ticket.status === 'PENDING' && (
            <View style={styles.actionFooter}>
              <Pressable style={[styles.btnAction, styles.approveBtn]} onPress={handleApprove}>
                <SymbolView name="checkmark" size={16} tintColor="#388E3C" />
                <ThemedText type="smallBold" style={{ color: '#388E3C' }}>
                  Approve Request
                </ThemedText>
              </Pressable>
              <Pressable style={[styles.btnAction, styles.rejectBtn]} onPress={handleReject}>
                <SymbolView name="xmark" size={16} tintColor="#D32F2F" />
                <ThemedText type="smallBold" style={{ color: '#D32F2F' }}>
                  Reject Request
                </ThemedText>
              </Pressable>
            </View>
          )}
        </View>

        {/* Info notice */}
        <ThemedText style={styles.noticeText}>
          Details generated from system records. Any updates will notify the respective supervisor and employee.
        </ThemedText>
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
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E1E6',
    marginVertical: Spacing.four,
  },
  infoSection: {
    gap: Spacing.three,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
  },
  descriptionSection: {
    gap: Spacing.two,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    backgroundColor: '#F8F9FB',
    padding: Spacing.three,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EFEFEF',
  },
  actionFooter: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.five,
  },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: Spacing.two,
  },
  approveBtn: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  rejectBtn: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  noticeText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: Spacing.five,
    marginTop: Spacing.four,
  },
});
