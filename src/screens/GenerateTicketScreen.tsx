import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  Share,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { RootStackParamList } from '../navigation/types';
import BTRLogo from '../components/BTRLogo';
import { generateTicket, Ticket } from '../storage/ticketStore';

import { Colors, Fonts, Spacing, Radius, Shadow } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'GenerateTicket'>;

export default function GenerateTicketScreen({ navigation }: Props) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (ticket) {
      // Already generated — confirm before issuing another
      Alert.alert(
        'Generate New Ticket?',
        'You already have an unsaved ticket. Generating a new one will issue a different number.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Generate', onPress: () => doGenerate() },
        ],
      );
      return;
    }
    doGenerate();
  }, [ticket]);

  const doGenerate = async () => {
    setLoading(true);
    try {
      const t = await generateTicket();
      setTicket(t);
    } catch {
      Alert.alert('Error', 'Could not generate ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!ticket) return;
    try {
      await Share.share({
        message: `My BTR Tuesday Service Ticket\nToken #${ticket.tokenNumber}\nTicket No: ${ticket.ticketNumber}\nEvent: ${ticket.eventName}\nLocation: ${ticket.eventLocation}\nSee you there!`,
        title: 'BTR Ticket',
      });
    } catch {
      // user cancelled share
    }
  };

  /** QR value encodes the ticket data as a JSON string */
  const qrValue = ticket
    ? JSON.stringify({
        ticketNumber: ticket.ticketNumber,
        tokenNumber: ticket.tokenNumber,
        event: ticket.eventName,
        date: ticket.eventDate,
        location: ticket.eventLocation,
        issued: ticket.createdAt,
      })
    : 'BTR-TICKET';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.deepBlue} />

      {/* Navigation header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Your Ticket</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket card */}
        <View style={styles.ticketCard}>
          {/* Ticket top: numbers */}
          <View style={styles.ticketHeader}>
            {/* Token number */}
            <View style={styles.numberBlock}>
              <Text style={styles.numberLabel}>TOKEN</Text>
              <Text style={styles.tokenNumber}>
                {ticket ? `#${ticket.tokenNumber}` : '---'}
              </Text>
            </View>

            <View style={styles.numberDivider} />

            {/* 9-digit ticket number */}
            <View style={styles.numberBlock}>
              <Text style={styles.numberLabel}>TICKET NO.</Text>
              <Text style={styles.ticketNumber}>
                {ticket ? ticket.ticketNumber : '---------'}
              </Text>
            </View>
          </View>

          <View style={styles.goldDivider} />

          {/* QR Code */}
          <View style={styles.qrContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.deepBlue} />
            ) : (
              <QRCode
                value={qrValue}
                size={180}
                color={Colors.deepBlue}
                backgroundColor={Colors.white}
                quietZone={8}
              />
            )}
          </View>

          {/* BTR Watermark logo below QR */}
          <View style={styles.watermark}>
            <BTRLogo size={70} color={Colors.deepBlue} bgColor="transparent" />
            <View style={styles.watermarkTextBox}>
              <Text style={styles.watermarkSmall}>Back to The</Text>
              <Text style={styles.watermarkBig}>ROOT OF WORSHIP</Text>
            </View>
          </View>

          <View style={styles.goldDivider} />

          {/* Service details */}
          <View style={styles.detailsBox}>
            <Text style={styles.serviceTitle}>
              {ticket ? ticket.eventName : 'Tuesday Service'}
            </Text>
            <Text style={styles.detailRow}>
              <Text style={styles.detailKey}>Date: </Text>
              <Text style={styles.detailVal}>
                {ticket ? ticket.eventDate : '—'}
              </Text>
            </Text>
            <Text style={styles.detailRow}>
              <Text style={styles.detailKey}>Location: </Text>
              <Text style={styles.detailVal}>
                {ticket ? ticket.eventLocation : '—'}
              </Text>
            </Text>
          </View>

          {/* Perforated edge */}
          <View style={styles.perforation} />
        </View>

        {/* Buttons */}
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={handleGenerate}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Generate Ticket"
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.btnTextPrimary}>
                {ticket ? 'Generate New Ticket' : 'Generate Ticket'}
              </Text>
            )}
          </TouchableOpacity>

          {ticket && (
            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary]}
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel="Share ticket"
            >
              <Text style={styles.btnTextSecondary}>Share Ticket</Text>
            </TouchableOpacity>
          )}

          {ticket && (
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline]}
              onPress={() => navigation.navigate('MyTickets')}
              accessibilityRole="button"
              accessibilityLabel="View all my tickets"
            >
              <Text style={styles.btnTextOutline}>View All Tickets</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  backBtn: {
    width: 36,
    alignItems: 'flex-start',
  },
  backArrow: {
    color: Colors.white,
    fontSize: 32,
    lineHeight: 32,
    fontWeight: '300',
  },
  navTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scroll: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  ticketCard: {
    backgroundColor: Colors.white,
    width: '100%',
    borderRadius: Radius.lg,
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    ...Shadow.card,
    borderTopWidth: 6,
    borderTopColor: Colors.deepBlue,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  numberBlock: {
    flex: 1,
    alignItems: 'center',
  },
  numberDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.lightGray,
    marginHorizontal: Spacing.sm,
  },
  numberLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.mediumGray,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tokenNumber: {
    fontSize: Fonts.sizes.xxl,
    color: Colors.deepBlue,
    fontWeight: '800',
    fontFamily: Fonts.heading,
    letterSpacing: 2,
  },
  ticketNumber: {
    fontSize: Fonts.sizes.lg,
    color: Colors.gold,
    fontWeight: '800',
    fontFamily: Fonts.heading,
    letterSpacing: 1.5,
  },
  goldDivider: {
    width: '80%',
    height: 2,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    marginVertical: Spacing.md,
  },
  qrContainer: {
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
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  watermarkTextBox: {
    alignItems: 'flex-start',
  },
  watermarkSmall: {
    fontSize: Fonts.sizes.xs,
    color: Colors.mediumGray,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  watermarkBig: {
    fontSize: Fonts.sizes.md,
    color: Colors.deepBlue,
    fontWeight: '700',
    fontFamily: Fonts.heading,
    letterSpacing: 0.5,
  },
  detailsBox: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  serviceTitle: {
    fontSize: Fonts.sizes.lg,
    color: Colors.deepBlue,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  detailRow: {
    fontSize: Fonts.sizes.md,
    color: Colors.darkGray,
  },
  detailKey: {
    fontWeight: '600',
    color: Colors.darkGray,
  },
  detailVal: {
    color: Colors.darkGray,
  },
  perforation: {
    marginTop: Spacing.lg,
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
  },
  btnGroup: {
    width: '100%',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  btn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: Colors.deepBlue,
    ...Shadow.button,
  },
  btnSecondary: {
    backgroundColor: Colors.gold,
    ...Shadow.card,
  },
  btnOutline: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.deepBlue,
  },
  btnTextPrimary: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  btnTextSecondary: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  btnTextOutline: {
    color: Colors.deepBlue,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
