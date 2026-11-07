import { DeclarationStatus, OfficeRole } from '../generated/api-types';

export const ROLE_LABELS: Record<OfficeRole, string> = {
  DEPARTURE: 'Abgang',
  DESTINATION: 'Bestimmung',
  BOTH: 'Abgang und Bestimmung',
};

export const STATUS_LABELS: Record<DeclarationStatus, string> = {
  OPEN: 'offen',
  ARRIVED: 'eingetroffen',
  CLOSED: 'erledigt',
};
