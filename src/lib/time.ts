import { formatDistanceToNow } from 'date-fns';

/**
 * Mengubah timestamp Unix (dari smart contract) menjadi format waktu relatif.
 * @param timestamp Timestamp dalam format bigint (detik).
 * @returns String seperti "about 5 hours ago".
 */
export const formatTimeAgo = (timestamp: bigint): string => {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp) * 1000);
  return formatDistanceToNow(date, { addSuffix: true });
};