import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export interface TicketProps {
  id: string;
  status: 'APPROVED' | 'PENDING' | 'DENIED' | 'OPEN' | 'IN PROGRESS' | 'RESOLVED';
  assignedTo?: { name: string; id: string };
  employee?: { name: string; id: string };
  createdBy?: { name: string; id: string };
  requestType: string;
  priority: 'Low' | 'Medium' | 'High';
  requestDate: string; // Used as submission date, e.g. "May 31"
  createdAt?: string;
  dateRange?: string; // Used as duration, e.g. "2025-06-22 to 2025-06-29"
  description?: string; // e.g. "Summer vacation"
  customFields?: Record<string, string>;
  ageSla?: { current: number; limit: number };
}

export function TicketCard({
  ticket,
  onApprove,
  onReject,
}: {
  ticket: TicketProps;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/ticket-detail',
      params: { id: ticket.id },
    });
  };

  const getTicketIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('vacation')) {
      return 'beach.umbrella.fill'; // Beach umbrella look
    } else if (t.includes('sick') || t.includes('licence')) {
      return 'cross.case.fill'; // Medical building/hospital
    } else if (t.includes('overtime')) {
      return 'clock.fill'; // Alarm clock
    } else if (t.includes('letter') || t.includes('carta')) {
      return 'doc.text.fill'; // Employment letter
    } else if (t.includes('benefit')) {
      return 'gift.fill'; // Gift box icon
    }
    return 'doc.text.fill';
  };

  const getIconColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('vacation')) {
      return '#FF7A00'; // Orange umbrella
    } else if (t.includes('sick') || t.includes('licence')) {
      return '#3C87F7'; // Blue hospital
    } else if (t.includes('overtime')) {
      return '#FF3B30'; // Red clock
    } else if (t.includes('letter') || t.includes('carta')) {
      return '#00C7BE'; // Teal document
    } else if (t.includes('benefit')) {
      return '#1EBD60'; // Green (matching theme)
    }
    return '#8E8E93';
  };

  const renderStatus = () => {
    const status = ticket.status;
    if (status === 'APPROVED' || status === 'RESOLVED') {
      return (
        <View style={styles.approvedBadge}>
          <SymbolView name="checkmark.circle.fill" size={12} tintColor="#1EBD60" />
        </View>
      );
    } else if (status === 'PENDING' || status === 'OPEN') {
      return (
        <SymbolView name="exclamationmark.triangle.fill" size={12} tintColor="#FFB000" />
      );
    } else if (status === 'DENIED' || status === 'IN PROGRESS') {
      return (
        <View style={styles.deniedRow}>
          <SymbolView name="xmark.circle.fill" size={12} tintColor="#FF3B30" />
        </View>
      );
    }
    return <ThemedText style={styles.pendingText}>{status}</ThemedText>;
  };

  console.log('ticket in ticket card: ', ticket)
  return (
    <View style={styles.cardContainer}>
      <Pressable style={styles.rowContainer} onPress={handlePress}>
        <View style={styles.leftCol}>
          <View style={styles.iconWrapper}>
            <SymbolView
              name={getTicketIcon(ticket.requestType) as any}
              size={26}
              tintColor={getIconColor(ticket.requestType)}
            />
          </View>
          <View style={styles.textContainer}>
            {ticket.createdBy && (
              <ThemedText style={styles.employeeText}>
                {ticket.createdBy.name}
              </ThemedText>
            )}
            <ThemedText style={styles.descriptionText}>
              {ticket.requestType || 'Request Details'}
            </ThemedText>
            <ThemedText style={styles.dateText}>
              {ticket.dateRange || ticket.requestDate}
            </ThemedText>
          </View>
        </View>

        <View style={styles.rightCol}>
          <View style={styles.statusWrapper}>{renderStatus()}</View>
          <ThemedText style={styles.requestDateText}>
            {ticket.requestDate}
          </ThemedText>
        </View>
      </Pressable>

      {onApprove && onReject && ticket.status === 'PENDING' && (
        <View style={styles.footer}>
          <Pressable style={[styles.actionButton, styles.approveBtn]} onPress={onApprove}>
            <SymbolView name="checkmark" size={14} tintColor="#388E3C" />
            <ThemedText type="smallBold" style={{ color: '#388E3C' }}>
              Approve
            </ThemedText>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.rejectBtn]} onPress={onReject}>
            <SymbolView name="xmark" size={14} tintColor="#D32F2F" />
            <ThemedText type="smallBold" style={{ color: '#D32F2F' }}>
              Reject
            </ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: Spacing.three,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8FA',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  employeeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  descriptionText: {
    fontSize: 14,
    color: '#60646C',
  },
  dateText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48,
  },
  statusWrapper: {
    marginBottom: 4,
  },
  approvedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  approvedText: {
    color: '#1EBD60',
    fontSize: 12,
    fontWeight: '700',
  },
  pendingText: {
    color: '#FFB000', // Yellow
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 4,
  },
  deniedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  deniedText: {
    color: '#FF3B30', // Red
    fontSize: 13,
    fontWeight: '700',
  },
  requestDateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E1E6',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    gap: Spacing.one,
  },
  approveBtn: {
    backgroundColor: '#E8F5E9',
  },
  rejectBtn: {
    backgroundColor: '#FFEBEE',
  },
});

