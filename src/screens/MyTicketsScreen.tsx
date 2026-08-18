import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
  Share,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { RootStackParamList } from '../navigation/types';
import { getTickets, Ticket } from '../storage/ticketStore';
import BTRLogo from '../components/BTRLogo';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MyTickets'>;

export default function MyTicketsScreen({ navigation }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);

  useFocusEffect(
    useCallback(() => {
      getTickets().then(setTickets);
    }, []),
  );

  const handleShare = async (t: Ticket) => {
    try {
      await Share.share({
        message: `BTR Ticket #${t.id}\nEvent: ${t.eventName}\nLocation: ${t.eventLocation}`,
        title: 'BTR Ticket',
      });
    } catch {
      // user cancelled
    }
  };

  const qrValue = (t: Ticket) =>
    JSON.stringify({
      ticketId: t.id,
      event: t.eventName,
      date: t.eventDate,
      location: t.eventLocation,
      issued: t.createdAt,
    });

  const renderTicket = ({ item }: { item: Ticket }) => (
    <View style={styles.ticketRow}>
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketNum}>Ticket #{item.id}</Text>
        <Text style={styles.ticketDate}>{item.eventDate}</Text>
      </View>

      {/* Mini QR thumbnail */}
      <View style={styles.qrThumb}>
        <QRCode
          value={qrValue(item)}
          size={48}
          color={Colors.deepBlue}
          backgroundColor={Colors.white}
          quietZone={2}
        />
      </View>

      <TouchableOpacity
        style={styles.detailBtn}
        onPress={() => setSelected(item)}
        accessibilityRole="button"
        accessibilityLabel={`View details for ticket ${item.id}`}
      >
        <Text style={styles.detailBtnText}>View</Text>
      </TouchableOpacity>
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
        <Text style={styles.navTitle}>My Tickets</Text>
        <View style={{ width: 36 }} />
      </View>

      {tickets.length === 0 ? (
        <View style={styles.empty}>
          <BTRLogo size={80} color={Colors.mediumGray} />
          <Text style={styles.emptyText}>No tickets yet</Text>
          <TouchableOpacity
            style={styles.generateBtn}
            onPress={() => navigation.navigate('GenerateTicket')}
            accessibilityRole="button"
          >
            <Text style={styles.generateBtnText}>Generate Your First Ticket</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={renderTicket}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* Bottom View Details bar (shown when tickets exist) */}
      {tickets.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => setSelected(tickets[0])}
            accessibilityRole="button"
          >
            <Text style={styles.viewAllText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Detail Modal */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ticket #{selected?.id}</Text>
              <Pressable
                onPress={() => setSelected(null)}
                style={styles.closeBtn}
                accessibilityLabel="Close"
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.goldDivider} />

            {/* Large QR */}
            <View style={styles.modalQr}>
              {selected && (
                <QRCode
                  value={qrValue(selected)}
                  size={200}
                  color={Colors.deepBlue}
                  backgroundColor={Colors.white}
                  quietZone={10}
                />
              )}
            </View>

            {/* Watermark */}
            <View style={styles.watermark}>
              <BTRLogo size={50} color={Colors.deepBlue} />
              <Text style={styles.watermarkText}>Back to the Root of Worship</Text>
            </View>

            <View style={styles.goldDivider} />

            {/* Details */}
            <View style={styles.modalDetails}>
              <Text style={styles.modalEventName}>{selected?.eventName}</Text>
              <Text style={styles.modalDetail}>📅  {selected?.eventDate}</Text>
              <Text style={styles.modalDetail}>📍  {selected?.eventLocation}</Text>
            </View>

            {/* Share */}
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => selected && handleShare(selected)}
              accessibilityRole="button"
              accessibilityLabel="Share this ticket"
            >
              <Text style={styles.shareBtnText}>Share Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
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
  navTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  list: {
    padding: Spacing.lg,
  },
  ticketRow: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    ...Shadow.card,
    borderLeftWidth: 4,
    borderLeftColor: Colors.gold,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketNum: {
    fontSize: Fonts.sizes.md,
    color: Colors.deepBlue,
    fontWeight: '700',
  },
  ticketDate: {
    fontSize: Fonts.sizes.sm,
    color: Colors.mediumGray,
    marginTop: 2,
  },
  qrThumb: {
    marginHorizontal: Spacing.md,
    padding: 4,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  detailBtn: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  detailBtnText: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  separator: {
    height: Spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyText: {
    color: Colors.mediumGray,
    fontSize: Fonts.sizes.lg,
    fontWeight: '500',
  },
  generateBtn: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.md,
    ...Shadow.button,
  },
  generateBtnText: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
  bottomBar: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  viewAllBtn: {
    backgroundColor: Colors.deepBlue,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadow.button,
  },
  viewAllText: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.lg * 1.5,
    borderTopRightRadius: Radius.lg * 1.5,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: '800',
    color: Colors.deepBlue,
  },
  closeBtn: {
    padding: Spacing.sm,
  },
  closeText: {
    fontSize: Fonts.sizes.lg,
    color: Colors.darkGray,
  },
  goldDivider: {
    width: '80%',
    height: 2,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    marginVertical: Spacing.md,
  },
  modalQr: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    ...Shadow.card,
  },
  watermark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  watermarkText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.deepBlue,
    fontWeight: '600',
    fontFamily: Fonts.heading,
  },
  modalDetails: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  modalEventName: {
    fontSize: Fonts.sizes.lg,
    color: Colors.deepBlue,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  modalDetail: {
    fontSize: Fonts.sizes.md,
    color: Colors.darkGray,
  },
  shareBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    ...Shadow.card,
    width: '100%',
    alignItems: 'center',
  },
  shareBtnText: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
