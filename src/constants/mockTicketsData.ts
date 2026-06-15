import { TicketProps } from '@/components/tickets/ticket-card';

export const mockMyTickets: TicketProps[] = [
  {
    id: 'NT-002605270003',
    status: 'OPEN',
    assignedTo: { name: 'Juan Prado', id: 'NT-5175' },
    requestType: 'Vacation Request',
    priority: 'Low',
    requestDate: 'May 27, 2026',
    ageSla: { current: 19, limit: 15 },
  },
  {
    id: 'NT-002604060003',
    status: 'OPEN',
    assignedTo: { name: 'Juan Prado', id: 'NT-5175' },
    requestType: 'Carta de Trabajo',
    priority: 'Low',
    requestDate: 'Apr 6, 2026',
    ageSla: { current: 70, limit: 7 },
  },
  {
    id: 'NT-002604060002',
    status: 'IN PROGRESS',
    assignedTo: { name: 'Juan Prado', id: 'NT-5175' },
    requestType: 'Carta de Trabajo',
    priority: 'Low',
    requestDate: 'Apr 6, 2026',
    ageSla: { current: 70, limit: 7 },
  },
  {
    id: 'NT-002604060001',
    status: 'IN PROGRESS',
    assignedTo: { name: 'Joel Aguiar', id: 'NTG-5220' },
    requestType: 'Vacation Request',
    priority: 'Low',
    requestDate: 'Apr 6, 2026',
    ageSla: { current: 70, limit: 15 },
  },
];

export const mockPendingRequests: TicketProps[] = [
  {
    id: 'NT-002605270003',
    status: 'OPEN',
    employee: { name: 'Samuel Luis', id: 'NTG-2037' },
    requestType: 'Vacation Request',
    priority: 'Low',
    requestDate: 'May 27, 2026',
    ageSla: { current: 19, limit: 15 },
  },
  {
    id: 'NT-002605260003',
    status: 'OPEN',
    employee: { name: 'Jerry Piero', id: 'NT-4566' },
    requestType: 'Vacation Request',
    priority: 'Low',
    requestDate: 'May 26, 2026',
    ageSla: { current: 20, limit: 15 },
  },
  {
    id: 'NT-002605250001',
    status: 'IN PROGRESS',
    employee: { name: 'Ticket Test', id: 'NT-1597' },
    requestType: 'Vacation Request',
    priority: 'Low',
    requestDate: 'May 25, 2026',
    ageSla: { current: 21, limit: 15 },
  },
  {
    id: 'NT-002605070003',
    status: 'OPEN',
    employee: { name: 'Juan Prado', id: 'NT-5175' },
    requestType: 'Test Type',
    priority: 'Medium',
    requestDate: 'May 7, 2026',
    ageSla: { current: 39, limit: 3 },
  },
];

export const mockMetrics = {
  myTickets: {
    total: 12,
    open: 9,
    resolved: 3,
    needAttention: undefined as number | undefined,
  },
  pendingRequests: {
    total: 232,
    needAttention: 86,
    open: 86,
    resolved: 146,
  },
};
