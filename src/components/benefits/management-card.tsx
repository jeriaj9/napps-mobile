import { SymbolView } from 'expo-symbols';
import { StyleSheet, View, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ManagementRequestProps {
  id: string;
  employeeName: string;
  employeeId: string;
  benefitName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  reason?: string;
}

export function ManagementCard({ request }: { request: ManagementRequestProps }) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.card} type="background">
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.employeeName}>{request.employeeName}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {request.employeeId}
          </ThemedText>
        </View>
        <View style={styles.statusBadge}>
          <SymbolView name="clock" size={10} tintColor="#E65100" />
          <ThemedText style={styles.statusText}>{request.status}</ThemedText>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.bodyRow}>
          <ThemedText type="small" themeColor="textSecondary">
            Benefit:
          </ThemedText>
          <ThemedText type="smallBold">{request.benefitName}</ThemedText>
        </View>
        <View style={styles.bodyRow}>
          <ThemedText type="small" themeColor="textSecondary">
            Requested:
          </ThemedText>
          <ThemedText type="small">{request.requestDate}</ThemedText>
        </View>
        <View style={styles.bodyRow}>
          <ThemedText type="small" themeColor="textSecondary">
            Reason:
          </ThemedText>
          <ThemedText type="small" style={styles.reasonText}>
            {request.reason || '—'}
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.actionButton, styles.approveBtn]}>
          <SymbolView name="checkmark" size={14} tintColor="#388E3C" />
          <ThemedText type="smallBold" style={{ color: '#388E3C' }}>
            Approve
          </ThemedText>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.rejectBtn]}>
          <SymbolView name="xmark" size={14} tintColor="#D32F2F" />
          <ThemedText type="smallBold" style={{ color: '#D32F2F' }}>
            Reject
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    marginHorizontal: Spacing.four,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E1E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: '#E65100',
    fontSize: 10,
    fontWeight: '700',
  },
  body: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reasonText: {
    flex: 1,
    textAlign: 'right',
    marginLeft: Spacing.four,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingTop: Spacing.three,
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
