import { TicketProps } from '@/components/tickets/ticket-card';
import { API_BASE, getAuthHeaders } from '@/constants/api';

export interface BackendTicket {
  id: number;
  ticket_number: number;
  request_type_id?: number;
  request_type?: string;
  comment: string;
  priority: string;
  status: string;
  owner?: number | { id: number; display_name: string; employee_id: string };
  created_by?: number | { id: number; display_name: string; employee_id: string };
  assigned_to?: number | { id: number; display_name: string; employee_id: string };
  created_at: string;
  updated_at: string;
}

export interface RequestTypeItem {
  id: number;
  categoryId?: number;
  name: string;
  description?: string;
}

export interface EmployeeItem {
  id: number;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  employeeId?: string;
  employee_id?: string;
}

export interface CustomFieldDef {
  id: number;
  request_type_id: number;
  name: string;
  label: string;
  type: string;
}

/**
 * Fetches all tickets accessible by the authenticated user.
 */
// export async function fetchTickets(token: string): Promise<BackendTicket[]> {
//   const response = await fetch(`${API_BASE}/tickets`, {
//     method: 'GET',
//     headers: getAuthHeaders(token),
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch tickets (${response.status})`);
//   }

//   const result = await response.json();
//   console.log('tickets data: ', result?.data);
//   if (result.status && Array.isArray(result.data)) {
//     return result.data;
//   } else if (Array.isArray(result)) {
//     return result;
//   }
//   return [];
// }

export async function fetchMyTickets(token: string, employeeId: string): Promise<BackendTicket[]> {
  console.log('employee_id: ', employeeId);
  const response = await fetch(`${API_BASE}/mobile/tickets?createdBy=${employeeId}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tickets (${response.status})`);
  }

  const result = await response.json();
  console.log('NEW TICKETS DATA: ', result?.data.tickets);
  if (result.data) {
    return result.data.tickets;
  }
  return [];
}

/**
 * Fetches all request types to map request_type_id to human readable names.
 */
export async function fetchRequestTypesMap(token: string): Promise<Record<number, string>> {
  try {
    const response = await fetch(`${API_BASE}/ticket-request-types/all`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) return {};

    const result = await response.json();
    const items: RequestTypeItem[] = result.status && Array.isArray(result.data) ? result.data : [];

    const map: Record<number, string> = {};
    items.forEach((item) => {
      if (item.id && item.name) {
        map[item.id] = item.name;
      }
    });
    return map;
  } catch (err) {
    console.error('Failed to fetch request types:', err);
    return {};
  }
}

/**
 * Fetches all employees to map employee ID to full name and employee code.
 */
export async function fetchEmployeesMap(token: string): Promise<Record<number, { name: string; id: string }>> {
  try {
    const response = await fetch(`${API_BASE}/employee/all`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) return {};

    const result = await response.json();
    const items: EmployeeItem[] = result.status && Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];

    const map: Record<number, { name: string; id: string }> = {};
    items.forEach((emp) => {
      const fName = emp.firstName || emp.first_name || '';
      const lName = emp.lastName || emp.last_name || '';
      const fullName = `${fName} ${lName}`.trim();
      const code = emp.employeeId || emp.employee_id || `NT-${emp.id}`;
      if (emp.id) {
        map[emp.id] = {
          name: fullName || `Employee #${emp.id}`,
          id: code,
        };
      }
    });
    return map;
  } catch (err) {
    console.error('Failed to fetch employees:', err);
    return {};
  }
}

/**
 * Fetches custom fields for a specific ticket.
 */
export async function fetchTicketFields(token: string, ticketId: number): Promise<Array<{ custom_field_id: number; value: string }>> {
  try {
    const response = await fetch(`${API_BASE}/tickets/${ticketId}/fields`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) return [];

    const result = await response.json();
    if (result.status && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  } catch (err) {
    console.error(`Failed to fetch custom fields for ticket ${ticketId}:`, err);
    return [];
  }
}

/**
 * Fetches custom field definitions for a request type.
 */
export async function fetchCustomFieldsDefs(token: string, requestTypeId: number): Promise<CustomFieldDef[]> {
  try {
    const response = await fetch(`${API_BASE}/ticket-custom-fields/${requestTypeId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) return [];

    const result = await response.json();
    if (result.status && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  } catch (err) {
    console.error(`Failed to fetch custom field definitions for request type ${requestTypeId}:`, err);
    return [];
  }
}

/**
 * Fetches a single ticket by ID and maps it to TicketProps with enriched details and dynamic custom fields.
 */
export async function fetchTicketById(token: string, ticketId: string | number): Promise<TicketProps | null> {
  try {
    const response = await fetch(`${API_BASE}/tickets/${ticketId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) return null;

    const result = await response.json();
    const rawTicket: BackendTicket | null = result.status && result.data ? result.data : null;

    if (!rawTicket) return null;

    const [requestTypesMap, employeesMap, customFieldsValues, fieldDefs] = await Promise.all([
      fetchRequestTypesMap(token),
      fetchEmployeesMap(token),
      fetchTicketFields(token, rawTicket.id),
      fetchCustomFieldsDefs(token, rawTicket.request_type_id),
    ]);

    const mapped = mapBackendTicketToTicketProps(rawTicket, requestTypesMap, employeesMap, customFieldsValues);

    // Build customFields dictionary { [label]: value }
    const customFieldsDict: Record<string, string> = {};
    if (fieldDefs.length > 0 && customFieldsValues.length > 0) {
      fieldDefs.forEach((def) => {
        const valObj = customFieldsValues.find((v) => v.custom_field_id === def.id);
        if (valObj && valObj.value != null && valObj.value.trim() !== '') {
          const keyName = def.label || def.name;
          customFieldsDict[keyName] = valObj.value;
        }
      });
    }
    mapped.customFields = customFieldsDict;

    return mapped;
  } catch (err) {
    console.error(`Failed to fetch ticket by ID ${ticketId}:`, err);
    return null;
  }
}

/**
 * Updates status of a ticket on the backend.
 */
export async function updateBackendTicketStatus(
  token: string,
  ticketId: string | number,
  newStatus: 'resolved' | 'rejected' | 'in_progress' | 'closed' | 'open',
  comment?: string
): Promise<boolean> {
  const response = await fetch(`${API_BASE}/tickets/${ticketId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      status: newStatus,
      comment: comment || `Status updated to ${newStatus}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update status for ticket ${ticketId} (${response.status})`);
  }

  const result = await response.json();
  return result.status === true;
}

/**
 * Maps a raw backend Ticket object to front-end TicketProps structure.
 */
export function mapBackendTicketToTicketProps(
  ticket: BackendTicket,
  requestTypeNameMap?: Record<number, string>,
  employeesMap?: Record<number, { name: string; id: string }>,
  customFieldValues?: Array<{ custom_field_id: number; value: string }>
): TicketProps {
  let mappedStatus: TicketProps['status'] = 'PENDING';
  const rawStatus = (ticket.status || '').toLowerCase();

  if (rawStatus === 'resolved' || rawStatus === 'closed' || rawStatus === 'approved') {
    mappedStatus = 'APPROVED';
  } else if (rawStatus === 'rejected' || rawStatus === 'denied') {
    mappedStatus = 'DENIED';
  } else if (rawStatus === 'in_progress') {
    mappedStatus = 'IN PROGRESS';
  } else if (rawStatus === 'open') {
    mappedStatus = 'PENDING';
  }

  let mappedPriority: TicketProps['priority'] = 'Medium';
  const rawPriority = (ticket.priority || '').toLowerCase();
  if (rawPriority === 'low') {
    mappedPriority = 'Low';
  } else if (rawPriority === 'high' || rawPriority === 'urgent') {
    mappedPriority = 'High';
  }

  let formattedDate = 'Recent';
  let fullCreatedAt = 'Recent';
  if (ticket.created_at) {
    try {
      const d = new Date(ticket.created_at);
      formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      fullCreatedAt = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      formattedDate = ticket.created_at;
      fullCreatedAt = ticket.created_at;
    }
  }

  // Find custom date range if present in field values
  let customDateRange: string | undefined = undefined;
  const fields = customFieldValues || (ticket as any).custom_fields;
  if (fields && fields.length > 0) {
    const dateField = fields.find(
      (f: any) => f.value && (typeof f.value === 'string') && (f.value.includes('|') || f.value.includes(' to ') || f.value.includes('-'))
    );
    if (dateField) {
      customDateRange = dateField.value.replace('|', ' to ');
    }
  }

  const reqTypeName = ticket.request_type
    ? ticket.request_type
    : (requestTypeNameMap && ticket.request_type_id && requestTypeNameMap[ticket.request_type_id])
      ? requestTypeNameMap[ticket.request_type_id]
      : `Ticket #${ticket.ticket_number || ticket.id}`;

  const createdByInfo = ticket.created_by && typeof ticket.created_by === 'object'
    ? { name: ticket.created_by.display_name, id: ticket.created_by.employee_id }
    : ticket.created_by && employeesMap && employeesMap[ticket.created_by as any]
      ? employeesMap[ticket.created_by as any]
      : ticket.created_by
        ? { name: `Employee #${ticket.created_by}`, id: `NT-${ticket.created_by}` }
        : undefined;

  const ownerInfo = ticket.owner && typeof ticket.owner === 'object'
    ? { name: ticket.owner.display_name, id: ticket.owner.employee_id }
    : ticket.owner && employeesMap && employeesMap[ticket.owner as any]
      ? employeesMap[ticket.owner as any]
      : undefined;

  const assigneeInfo = ticket.assigned_to && typeof ticket.assigned_to === 'object'
    ? { name: ticket.assigned_to.display_name, id: ticket.assigned_to.employee_id }
    : ticket.assigned_to && employeesMap && employeesMap[ticket.assigned_to as any]
      ? employeesMap[ticket.assigned_to as any]
      : ticket.assigned_to
        ? { name: `Assignee #${ticket.assigned_to}`, id: `NT-${ticket.assigned_to}` }
        : undefined;

  const employeeInfo = ownerInfo || createdByInfo;

  return {
    id: String(ticket.id),
    status: mappedStatus,
    requestType: reqTypeName,
    priority: mappedPriority,
    requestDate: formattedDate,
    createdAt: fullCreatedAt,
    description: ticket.comment || reqTypeName,
    dateRange: customDateRange || formattedDate,
    employee: employeeInfo,
    createdBy: createdByInfo,
    assignedTo: assigneeInfo,
  };
}
