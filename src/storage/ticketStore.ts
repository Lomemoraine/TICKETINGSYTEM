import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Ticket {
  /** Sequential token number, e.g. "001", "002" … up to "3000" */
  tokenNumber: string;
  /** Raw sequential integer */
  number: number;
  /**
   * 9-digit ticket number: [4-digit seq][M(no pad)][DD][YY]
   * e.g. ticket 1 on 18 Aug 2026 → "000181826"
   *      ticket 2 on same day    → "000281826"
   */
  ticketNumber: string;
  createdAt: string;   // ISO date string
  eventDate: string;
  eventLocation: string;
  eventName: string;
}

const STORAGE_KEY = '@btr_tickets';
const COUNTER_KEY = '@btr_ticket_counter';

/**
 * Build the 9-digit ticket number from a sequential integer and a Date.
 * Format: SSSSMDDY  where:
 *   SSSS = 4-digit zero-padded sequence (supports up to 9999)
 *   M    = month without leading zero (1-12)
 *   DD   = 2-digit day
 *   YY   = 2-digit year
 *
 * Example: seq=1, date=Aug 18 2026 → "0001" + "8" + "18" + "26" = "000181826"
 */
function buildTicketNumber(seq: number, date: Date): string {
  const seq4 = String(seq).padStart(4, '0');
  const month = String(date.getMonth() + 1);          // no leading zero
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);   // last 2 digits
  return `${seq4}${month}${day}${year}`;
}

/** Return all stored tickets, newest first. */
export async function getTickets(): Promise<Ticket[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Ticket[];
  } catch {
    return [];
  }
}

/** Generate the next ticket and persist it. */
export async function generateTicket(): Promise<Ticket> {
  // Fetch and increment counter
  const raw = await AsyncStorage.getItem(COUNTER_KEY);
  const next = raw ? parseInt(raw, 10) + 1 : 1;
  await AsyncStorage.setItem(COUNTER_KEY, String(next));

  const now = new Date();

  const ticket: Ticket = {
    tokenNumber: String(next).padStart(3, '0'),
    number: next,
    ticketNumber: buildTicketNumber(next, now),
    createdAt: now.toISOString(),
    eventDate: 'Tuesday Service',
    eventLocation: 'Main Church Hall',
    eventName: 'Back to the Root of Worship',
  };

  const existing = await getTickets();
  const updated = [ticket, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return ticket;
}

/** Return the current counter value (last issued number). */
export async function getCurrentCounter(): Promise<number> {
  const raw = await AsyncStorage.getItem(COUNTER_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

/**
 * Return all tickets generated on a specific calendar date (local time).
 * @param date - any Date object; only the year/month/day portion is used.
 */
export async function getTicketsByDate(date: Date): Promise<Ticket[]> {
  const all = await getTickets();
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  return all.filter((t) => {
    const created = new Date(t.createdAt);
    return (
      created.getFullYear() === y &&
      created.getMonth() === m &&
      created.getDate() === d
    );
  });
}

/**
 * Return a map of date-strings (YYYY-MM-DD) to ticket counts for every day
 * that has at least one ticket. Useful for rendering the date picker summary.
 */
export async function getTicketCountsByDay(): Promise<Record<string, number>> {
  const all = await getTickets();
  const map: Record<string, number> = {};
  for (const t of all) {
    const created = new Date(t.createdAt);
    const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}-${String(created.getDate()).padStart(2, '0')}`;
    map[key] = (map[key] ?? 0) + 1;
  }
  return map;
}

/** Format a Date to a YYYY-MM-DD key string (local time). */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
