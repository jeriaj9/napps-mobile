import { BenefitProps } from '@/components/benefits/benefit-card';
import { API_BASE, getAuthHeaders } from '@/constants/api';

export interface BackendBenefitWithStatus {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  minTimeAtCompany: number;
  maxUsageDuration: number;
  maxUsageCount: number;
  status: 'active' | 'pending' | 'available' | 'locked';
  lockReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendEmployeeBenefit {
  id: number;
  employeeId?: number;
  partyRefId?: number;
  benefitId: number;
  status: string;
  requestedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

/**
 * Maps a backend BenefitWithStatus object into the mobile BenefitProps interface.
 */
export function mapBackendBenefitToBenefitProps(item: BackendBenefitWithStatus): BenefitProps {
  const minTimeStr =
    item.minTimeAtCompany === 0
      ? 'Immediate'
      : `${item.minTimeAtCompany} mo`;

  const durationStr =
    item.maxUsageDuration > 0
      ? `${item.maxUsageDuration} mo`
      : 'Unlimited';

  const countStr =
    item.maxUsageCount > 0
      ? `${item.maxUsageCount} ${item.maxUsageCount === 1 ? 'time' : 'times'}`
      : 'Unlimited';

  return {
    id: String(item.id),
    title: item.title,
    details: item.description,
    description: item.description,
    imageUrl: item.imageUrl || undefined,
    minTimeAtCompany: minTimeStr,
    maxUsageDurationMonths: durationStr,
    maxUsageCount: countStr,
    isEnjoying: item.status === 'active',
    status: item.status,
    lockReason: item.lockReason,
  };
}

/**
 * Fetches benefits with computed employee status for a given employee (or party).
 * Endpoint: GET /benefits/employee/{employeeId}
 */
export async function fetchEmployeeBenefits(
  token: string,
  employeeId: number
): Promise<BackendBenefitWithStatus[]> {
  try {
    const response = await fetch(`${API_BASE}/benefits/employee/${employeeId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch benefits (${response.status}):`, errorText);
      throw new Error(`Failed to fetch benefits (Status ${response.status})`);
    }

    const data: BackendBenefitWithStatus[] = await response.json();
    return data || [];
  } catch (err) {
    console.error('Error fetching employee benefits:', err);
    throw err;
  }
}

/**
 * Submits a benefit enrollment request for a specific benefit.
 * Endpoint: POST /benefits/{benefitId}/request
 */
export async function requestBenefit(
  token: string,
  benefitId: number,
  partyId: number
): Promise<BackendEmployeeBenefit> {
  try {
    const response = await fetch(`${API_BASE}/benefits/${benefitId}/request`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ partyId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.message || errorData.error || `Status ${response.status}`;
      throw new Error(errorMsg);
    }

    const data: BackendEmployeeBenefit = await response.json();
    return data;
  } catch (err) {
    console.error(`Error requesting benefit ${benefitId}:`, err);
    throw err;
  }
}

/**
 * Fetches a single benefit details by ID.
 * Endpoint: GET /benefits/{benefitId}
 */
export async function fetchBenefitById(
  token: string,
  benefitId: number
): Promise<BackendBenefitWithStatus | null> {
  try {
    const response = await fetch(`${API_BASE}/benefits/${benefitId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch benefit details (Status ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error fetching benefit ${benefitId}:`, err);
    throw err;
  }
}
