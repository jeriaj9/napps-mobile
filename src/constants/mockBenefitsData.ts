import { BenefitProps } from '@/components/benefits/benefit-card';
import { ManagementRequestProps } from '@/components/benefits/management-card';

export const mockAllBenefits: BenefitProps[] = [
  {
    id: '1',
    title: 'Test Benefit',
    description: 'test',
    thumbnailInitials: 'TE',
  },
  {
    id: '2',
    title: 'Membresía Corporativa FixoCargo',
    description: 'Tarifa preferencial en uso de Courier.',
    thumbnailInitials: 'FI',
  },
  {
    id: '3',
    title: 'Membresía Corporativa EPS',
    description: 'Tarifa preferencial en uso de Courier.',
    thumbnailInitials: 'EP',
  },
  {
    id: '4',
    title: 'Pago de Certificaciones',
    description: 'La certificación debe estar relacionada directamente con su línea de trabajo.',
    thumbnailInitials: 'PA',
  },
  {
    id: '5',
    title: 'Membresia Corporativa a Gimnasio',
    description: 'Subsidio a membresía en Body Shop.',
    thumbnailInitials: 'GI',
  },
  {
    id: '6',
    title: 'Seguro de vida',
    description: 'Prueba de Thumbnail.',
    thumbnailInitials: 'SE',
  },
  {
    id: '7',
    title: 'Fripick',
    description: 'Subsidio de almuerzo / Farmacia Los Hidalgos',
    thumbnailInitials: 'FR',
  },
];

export const mockEnjoyingBenefits: BenefitProps[] = [
  {
    id: '5',
    title: 'Membresia Corporativa a Gimnasio',
    description: 'Subsidio a membresía en Body Shop.',
    thumbnailInitials: 'GI',
    isEnjoying: true,
  },
];

export const mockManagementRequests: ManagementRequestProps[] = [
  {
    id: '1',
    employeeName: 'LEOBARDO NÚÑEZ',
    employeeId: 'NT-5890',
    benefitName: 'Pago de Certificaciones',
    status: 'PENDING',
    requestDate: 'May 1, 2026',
    reason: '—',
  },
];
