import { SymbolView, SFSymbol } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface TicketProps {
  id: string;
  status: 'OPEN' | 'IN PROGRESS' | 'RESOLVED';
  assignedTo?: { name: string; id: string };
  employee?: { name: string; id: string };
  requestType: string;
  priority: 'Low' | 'Medium' | 'High';
  requestDate: string;
  ageSla: { current: number; limit: number };
}

export function TicketCard({ ticket }: { ticket: TicketProps }) {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return { bg: '#E3F2FD', text: '#1976D2' };
      case 'IN PROGRESS': return { bg: '#FFF3E0', text: '#F57C00' };
      case 'RESOLVED': return { bg: '#E8F5E9', text: '#388E3C' };
      default: return { bg: '#F5F5F5', text: '#9E9E9E' };
    }
  };

  const getPriorityIcon = (priority: string): SFSymbol => {
    switch (priority) {
      case 'Low': return 'chevron.down.2';
      case 'Medium': return 'equal';
      case 'High': return 'chevron.up.2';
      default: return 'minus';
    }
  };

  const statusColors = getStatusColor(ticket.status);
  const person = ticket.employee || ticket.assignedTo;
  const personLabel = ticket.employee ? 'Employee' : 'Assigned To';

  return (
    <ThemedView style={styles.card} type="background">
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.requestType}>{ticket.requestType}</ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <ThemedText style={[styles.statusText, { color: statusColors.text }]}>{ticket.status}</ThemedText>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <ThemedText type="small" themeColor="textSecondary">ID:</ThemedText>
          <View style={styles.idContainer}>
            <ThemedText type="smallBold">{ticket.id}</ThemedText>
            <SymbolView name="doc.on.doc" size={12} tintColor={theme.textSecondary} />
          </View>
        </View>

        {person && (
          <View style={styles.row}>
            <ThemedText type="small" themeColor="textSecondary">{personLabel}:</ThemedText>
            <View style={styles.personContainer}>
               <ThemedText type="small">{person.name}</ThemedText>
               <ThemedText type="small" themeColor="textSecondary">{person.id}</ThemedText>
            </View>
          </View>
        )}

        <View style={styles.row}>
          <ThemedText type="small" themeColor="textSecondary">Priority:</ThemedText>
          <View style={styles.priorityContainer}>
            <SymbolView name={getPriorityIcon(ticket.priority)} size={12} tintColor={theme.text} />
            <ThemedText type="small">{ticket.priority}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText type="small" themeColor="textSecondary">{ticket.requestDate}</ThemedText>
        <View style={styles.slaContainer}>
          <SymbolView name="exclamationmark.circle" size={14} tintColor="#D32F2F" />
          <ThemedText style={styles.slaText}>{ticket.ageSla.current} d / {ticket.ageSla.limit} d</ThemedText>
        </View>
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
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  requestType: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  body: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  personContainer: {
    alignItems: 'flex-end',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E1E6',
  },
  slaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  slaText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
  },
});
