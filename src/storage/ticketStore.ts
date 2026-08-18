import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Ticket {
  id: string;          // e.g. "045"
  number: number;      // numeric value
  createdAt: string;   // ISO date string
  eventDate: string;
  eventLocation: string;
  eventName: string;
}

const STORAGE_KEY = '@btr_tickets';
const COUNTER_KEY = '@btr_ticket_counter';

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

  const ticket: Ticket = {
    id: String(next).padStart(3, '0'),
    number: next,
    createdAt: new Date().toISOString(),
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
