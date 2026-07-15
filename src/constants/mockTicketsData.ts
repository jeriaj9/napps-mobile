import { TicketProps } from '@/components/tickets/ticket-card';

export const mockMyTickets: TicketProps[] = [
  {
    id: '1',
    status: 'APPROVED',
    requestType: 'Vacation Days',
    description: 'Summer vacation',
    dateRange: '2025-06-22 to 2025-06-29',
    requestDate: 'May 31',
    priority: 'Low',
  },
  {
    id: '2',
    status: 'APPROVED',
    requestType: 'Sick Leave',
    description: 'Sick leave',
    dateRange: '2025-05-15',
    requestDate: 'May 14',
    priority: 'Medium',
  },
  {
    id: '3',
    status: 'PENDING',
    requestType: 'Vacation Days',
    description: 'Family trip',
    dateRange: '2025-07-10 to 2025-07-17',
    requestDate: 'Jun 9',
    priority: 'Low',
  },
  {
    id: '4',
    status: 'DENIED',
    requestType: 'Overtime',
    description: 'Project deadline',
    dateRange: '2025-05-20',
    requestDate: 'May 17',
    priority: 'High',
  },
];

export const mockPendingRequests: TicketProps[] = [
  {
    id: '5',
    status: 'PENDING',
    employee: { name: 'Samuel Luis', id: 'NTG-2037' },
    requestType: 'Vacation Days',
    description: 'Family trip',
    dateRange: '2025-07-10 to 2025-07-17',
    requestDate: 'Jun 9',
    priority: 'Low',
  },
  {
    id: 'req-mgmt-1',
    status: 'PENDING',
    employee: { name: 'LEOBARDO NÚÑEZ', id: 'NT-5890' },
    requestType: 'Benefit: Health Insurance',
    description: 'Health Insurance',
    requestDate: 'May 1, 2026',
    priority: 'Medium',
  },
];

export const mockMetrics = {
  myTickets: {
    total: 4,
    open: 1,
    resolved: 2,
    needAttention: 1,
  },
  pendingRequests: {
    total: 2,
    needAttention: 2,
    open: 2,
    resolved: 0,
  },
};

export function addTicket(ticket: TicketProps) {
  mockMyTickets.unshift(ticket);
  mockPendingRequests.unshift(ticket);
}

export function updateTicketStatus(id: string, status: TicketProps['status']) {
  const pendingIdx = mockPendingRequests.findIndex(t => t.id === id);
  if (pendingIdx !== -1) mockPendingRequests[pendingIdx].status = status;

  const myIdx = mockMyTickets.findIndex(t => t.id === id);
  if (myIdx !== -1) mockMyTickets[myIdx].status = status;
}


