import * as Notifications from 'expo-notifications';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export interface ManagementRequestProps {
  id: string;
  employeeName: string;
  employeeId: string;
  benefitName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  reason?: string;
}

export function ManagementCard({
  request,
  onApprove,
  onReject,
}: {
  request: ManagementRequestProps;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const [currentStatus, setCurrentStatus] = useState<string>(request.status);

  const handleApprovePress = async () => {
    setCurrentStatus('APPROVED');
    onApprove?.();

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
            title: 'Request Approved! 🎟️🎉',
            body: `The request for "${request.benefitName}" has been approved.`,
            sound: true,
          },
          trigger: null,
        });
      }
    } catch (e) {
      console.log('Notification error:', e);
    }
  };

  const handleRejectPress = () => {
    setCurrentStatus('REJECTED');
    onReject?.();
  };

  const isApproved = currentStatus === 'APPROVED';
  const isRejected = currentStatus === 'REJECTED';

  return (
    <ThemedView style={styles.card} type="background">
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.employeeName}>{request.employeeName}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {request.employeeId}
          </ThemedText>
        </View>
        <View
          style={[
            styles.statusBadge,
            isApproved && styles.statusBadgeApproved,
            isRejected && styles.statusBadgeRejected,
          ]}
        >
          <SymbolView
            name={isApproved ? 'checkmark.circle.fill' : isRejected ? 'xmark.circle.fill' : 'clock'}
            size={10}
            tintColor={isApproved ? '#388E3C' : isRejected ? '#D32F2F' : '#E65100'}
          />
          <ThemedText
            style={[
              styles.statusText,
              isApproved && styles.statusTextApproved,
              isRejected && styles.statusTextRejected,
            ]}
          >
            {currentStatus}
          </ThemedText>
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

      {currentStatus === 'PENDING' && (
        <View style={styles.footer}>
          <Pressable style={[styles.actionButton, styles.approveBtn]} onPress={handleApprovePress}>
            <SymbolView name="checkmark" size={14} tintColor="#388E3C" />
            <ThemedText type="smallBold" style={{ color: '#388E3C' }}>
              Approve
            </ThemedText>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.rejectBtn]} onPress={handleRejectPress}>
            <SymbolView name="xmark" size={14} tintColor="#D32F2F" />
            <ThemedText type="smallBold" style={{ color: '#D32F2F' }}>
              Reject
            </ThemedText>
          </Pressable>
        </View>
      )}
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
  statusBadgeApproved: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgeRejected: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    color: '#E65100',
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextApproved: {
    color: '#388E3C',
  },
  statusTextRejected: {
    color: '#D32F2F',
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
