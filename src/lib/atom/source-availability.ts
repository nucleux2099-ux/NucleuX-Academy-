export const ATOM_SOURCE_AVAILABILITY_STATUSES = [
  'indexed_ready',
  'md_ready_not_ingested',
  'pdf_only',
  'missing',
] as const;

export type AtomSourceAvailabilityStatus = (typeof ATOM_SOURCE_AVAILABILITY_STATUSES)[number];

export function getAvailabilityDisabledReason(status: AtomSourceAvailabilityStatus): string | null {
  if (status === 'indexed_ready') return null;
  if (status === 'md_ready_not_ingested') return 'Markdown source available, pending ingestion/indexing';
  if (status === 'pdf_only') return 'Only PDF detected, markdown ingestion pending';
  return 'Source files not detected on this machine';
}
