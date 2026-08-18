import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {
  getTicketsByDate,
  getTicketCountsByDay,
  toDateKey,
  Ticket,
} from '../storage/ticketStore';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;

/** Format a Date to a human-readable string: "Monday, 18 Aug 2026" */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format an ISO string to "HH:MM" local time */
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Add or subtract calendar days from a Date */
function shiftDate(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Check if two Dates fall on the same calendar day */
function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

export default function AdminDashboardScreen({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [dayCounts, setDayCounts] = useState<Record<string, number>>({});

  const today = new Date();

  const loadData = useCallback(async () => {
    const [dayTickets, counts] = await Promise.all([
      getTicketsByDate(selectedDate),
      getTicketCountsByDay(),
    ]);
    // Sort ascending by token number so the list reads 001 → 002 → ...
    dayTickets.sort((a, b) => a.number - b.number);
    setTickets(dayTickets);
    setDayCounts(counts);
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  /* ── derived stats ── */
  const total = tickets.length;
  const firstToken = total > 0 ? tickets[0].tokenNumber : '—';
  const lastToken = total > 0 ? tickets[total - 1].tokenNumber : '—';
  const isToday = isSameDay(selectedDate, today);

  /* ── days that have tickets, for the dot indicators on arrows ── */
  const prevKey = toDateKey(shiftDate(selectedDate, -1));
  const nextKey = toDateKey(shiftDate(selectedDate, 1));
  const hasPrev = (dayCounts[prevKey] ?? 0) > 0;
  const hasNext = (dayCounts[nextKey] ?? 0) > 0;

  /* ── share summary ── */
  const handleShareSummary = async () => {
    if (total === 0) {
      Alert.alert('No tickets', 'There are no tickets to share for this day.');
      return;
    }
    const lines = [
      `BTR Admin Summary — ${formatDate(selectedDate)}`,
      `Total Tickets: ${total}`,
      `Token Range: #${firstToken} → #${lastToken}`,
      '',
      ...tickets.map(
        (t) =>
          `Token #${t.tokenNumber}  |  Ticket ${t.ticketNumber}  |  ${formatTime(t.createdAt)}`,
      ),
    ];
    await Share.share({ message: lines.join('\n'), title: 'BTR Ticket Summary' });
  };

  /* ── render each ticket row ── */
  const renderRow = ({ item, index }: { item: Ticket; index: number }) => (
    <View style={styles.row}>
      {/* Row index */}
      <Text style={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</Text>

      <View style={styles.rowDivider} />

      {/* Token */}
      <View style={styles.rowCell}>
        <Text style={styles.rowCellLabel}>TOKEN</Text>
        <Text style={styles.rowToken}>#{item.tokenNumber}</Text>
      </View>

      <View style={styles.rowDivider} />

      {/* Ticket number */}
      <View style={[styles.rowCell, styles.rowCellWide]}>
        <Text style={styles.rowCellLabel}>TICKET NO.</Text>
        <Text style={styles.rowTicketNum}>{item.ticketNumber}</Text>
      </View>

      <View style={styles.rowDivider} />

      {/* Time issued */}
      <View style={styles.rowCell}>
        <Text style={styles.rowCellLabel}>ISSUED</Text>
        <Text style={styles.rowTime}>{formatTime(item.createdAt)}</Text>
      </View>
    </View>
  );

  /* ── list header (date picker + stats) ── */
  const ListHeader = (
    <>
      {/* Date navigator */}
      <View style={styles.datePicker}>
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => setSelectedDate((d) => shiftDate(d, -1))}
          accessibilityLabel="Previous day"
        >
          <Text style={styles.arrowText}>‹</Text>
          {hasPrev && <View style={styles.dot} />}
        </TouchableOpacity>

        <View style={styles.dateCenter}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          {isToday && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>TODAY</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => setSelectedDate((d) => shiftDate(d, 1))}
          accessibilityLabel="Next day"
          disabled={isToday}
        >
          <Text style={[styles.arrowText, isToday && styles.arrowDisabled]}>›</Text>
          {hasNext && <View style={styles.dot} />}
        </TouchableOpacity>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>Total Tickets</Text>
        </View>
        <View style={[styles.statCard, styles.statCardMid]}>
          <Text style={styles.statValue}>#{firstToken}</Text>
          <Text style={styles.statLabel}>First Token</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>#{lastToken}</Text>
          <Text style={styles.statLabel}>Last Token</Text>
        </View>
      </View>

      {/* Column headers */}
      {total > 0 && (
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: 28 }]}>#</Text>
          <View style={styles.rowDivider} />
          <Text style={[styles.tableHeaderCell, styles.tableHeaderToken]}>TOKEN</Text>
          <View style={styles.rowDivider} />
          <Text style={[styles.tableHeaderCell, styles.tableHeaderTicket]}>TICKET NO.</Text>
          <View style={styles.rowDivider} />
          <Text style={[styles.tableHeaderCell, styles.tableHeaderTime]}>ISSUED</Text>
        </View>
      )}
    </>
  );

  /* ── empty state ── */
  const EmptyState = (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No tickets</Text>
      <Text style={styles.emptySubtitle}>
        No tickets were generated on {formatDate(selectedDate)}.
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.deepBlue} />

      {/* Nav header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <View style={styles.navTitleBox}>
          <Text style={styles.navTitle}>Admin Dashboard</Text>
          <Text style={styles.navSubtitle}>Ticket Management</Text>
        </View>

        <TouchableOpacity
          onPress={handleShareSummary}
          style={styles.shareBtn}
          accessibilityLabel="Share summary"
          accessibilityRole="button"
        >
          <Text style={styles.shareIcon}>↑</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.tokenNumber}
        renderItem={renderRow}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer total bar */}
      {total > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {total} ticket{total !== 1 ? 's' : ''} issued on {formatDate(selectedDate)}
          </Text>
          <TouchableOpacity
            onPress={handleShareSummary}
            accessibilityRole="button"
            accessibilityLabel="Export summary"
          >
            <Text style={styles.footerExport}>Export ↑</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },

  /* ── nav header ── */
  navHeader: {
    backgroundColor: Colors.deepBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: Colors.gold,
  },
  backBtn: { width: 36, alignItems: 'flex-start' },
  backArrow: { color: Colors.white, fontSize: 32, lineHeight: 32, fontWeight: '300' },
  navTitleBox: { alignItems: 'center' },
  navTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  navSubtitle: {
    color: Colors.gold,
    fontSize: Fonts.sizes.xs,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
  },

  /* ── date picker ── */
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.card,
  },
  arrowBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    paddingVertical: Spacing.xs,
  },
  arrowText: {
    fontSize: 32,
    color: Colors.deepBlue,
    fontWeight: '300',
    lineHeight: 36,
  },
  arrowDisabled: {
    color: Colors.lightGray,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.gold,
    marginTop: 2,
  },
  dateCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: Fonts.sizes.md,
    color: Colors.deepBlue,
    fontWeight: '700',
    textAlign: 'center',
  },
  todayBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  todayBadgeText: {
    color: Colors.white,
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  /* ── stats bar ── */
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
    borderTopWidth: 3,
    borderTopColor: Colors.deepBlue,
  },
  statCardMid: {
    borderTopColor: Colors.gold,
  },
  statValue: {
    fontSize: Fonts.sizes.xl,
    fontWeight: '800',
    color: Colors.deepBlue,
    fontFamily: Fonts.heading,
  },
  statLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.mediumGray,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  /* ── table header ── */
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.deepBlue,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  tableHeaderCell: {
    color: Colors.gold,
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tableHeaderToken: { flex: 1 },
  tableHeaderTicket: { flex: 2 },
  tableHeaderTime: { flex: 1 },

  /* ── ticket rows ── */
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    ...Shadow.card,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  rowIndex: {
    width: 24,
    fontSize: Fonts.sizes.xs,
    color: Colors.mediumGray,
    fontWeight: '600',
    textAlign: 'center',
  },
  rowDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.lightGray,
    marginHorizontal: Spacing.sm,
  },
  rowCell: {
    flex: 1,
    alignItems: 'center',
  },
  rowCellWide: {
    flex: 2,
  },
  rowCellLabel: {
    fontSize: 9,
    color: Colors.mediumGray,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  rowToken: {
    fontSize: Fonts.sizes.md,
    fontWeight: '800',
    color: Colors.deepBlue,
    fontFamily: Fonts.heading,
  },
  rowTicketNum: {
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    color: Colors.gold,
    letterSpacing: 1,
    fontFamily: Fonts.heading,
  },
  rowTime: {
    fontSize: Fonts.sizes.sm,
    color: Colors.darkGray,
    fontWeight: '500',
  },

  /* ── empty state ── */
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: Fonts.sizes.lg,
    color: Colors.darkGray,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.mediumGray,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* ── footer ── */
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  footerText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.darkGray,
    fontWeight: '500',
    flex: 1,
  },
  footerExport: {
    fontSize: Fonts.sizes.sm,
    color: Colors.deepBlue,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
