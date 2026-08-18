import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import BTRLogo from '../components/BTRLogo';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AboutMinistry'>;

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
}

function InfoRow({ icon, label, value, onPress }: InfoRowProps) {
  return (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'link' : 'text'}
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoTextBox}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, onPress && styles.infoLink]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AboutMinistryScreen({ navigation }: Props) {
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
        <Text style={styles.navTitle}>About the Ministry</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero logo card */}
        <View style={styles.heroCard}>
          <BTRLogo size={110} color={Colors.deepBlue} bgColor="transparent" />
          <View style={styles.goldDivider} />
          <Text style={styles.ministryName}>
            Dr. Sarah K Tuesday Worship{'\n'}Ministries
          </Text>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>Every Tuesday • Main Church Hall</Text>
          </View>
        </View>

        {/* Mission statement */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.bodyText}>
            Join us every Tuesday for a powerful worship experience led by Dr. Sarah K.
            We are dedicated to bringing believers back to the foundational roots of authentic,
            Spirit-filled worship — where hearts are transformed and lives are renewed.
          </Text>
        </View>

        {/* About section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>About Us</Text>
          </View>
          <Text style={styles.bodyText}>
            Dr. Sarah K Tuesday Worship Ministries is a vibrant community of believers committed
            to experiencing and expressing the depth of God's presence through worship. Our
            services are designed to be welcoming, Spirit-led, and rooted in the Word of God.
          </Text>
          <Text style={[styles.bodyText, { marginTop: Spacing.sm }]}>
            We believe that authentic worship is the foundation of a thriving spiritual life —
            a returning to the roots of what it means to encounter the Living God.
          </Text>
        </View>

        {/* Service Times */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Service Times</Text>
          </View>
          <View style={styles.serviceCard}>
            <Text style={styles.serviceDay}>Tuesday Service</Text>
            <Text style={styles.serviceTime}>Every Tuesday · 6:00 PM</Text>
            <Text style={styles.serviceLocation}>📍 Main Church Hall</Text>
          </View>
        </View>

        {/* Contact info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Contact Us</Text>
          </View>

          <InfoRow
            icon="📞"
            label="Phone"
            value="(123) 456-7890"
            onPress={() => Linking.openURL('tel:+11234567890')}
          />
          <InfoRow
            icon="🌐"
            label="Website"
            value="www.example.com"
            onPress={() => Linking.openURL('https://www.example.com')}
          />
          <InfoRow
            icon="📧"
            label="Email"
            value="info@example.com"
            onPress={() => Linking.openURL('mailto:info@example.com')}
          />
          <InfoRow icon="📍" label="Location" value="Main Church Hall" />
        </View>

        {/* Generate ticket CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('GenerateTicket')}
          accessibilityRole="button"
          accessibilityLabel="Generate a ticket for the service"
        >
          <Text style={styles.ctaText}>Get Your Ticket →</Text>
        </TouchableOpacity>
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
  backBtn: { width: 36, alignItems: 'flex-start' },
  backArrow: { color: Colors.white, fontSize: 32, lineHeight: 32, fontWeight: '300' },
  navTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.card,
    borderTopWidth: 5,
    borderTopColor: Colors.gold,
  },
  goldDivider: {
    width: 60,
    height: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    marginVertical: Spacing.md,
  },
  ministryName: {
    fontSize: Fonts.sizes.xl,
    color: Colors.deepBlue,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: Fonts.heading,
    lineHeight: 28,
  },
  tagBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(26,43,94,0.08)',
    borderRadius: Radius.full,
  },
  tagText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.deepBlue,
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    color: Colors.deepBlue,
    fontWeight: '700',
  },
  bodyText: {
    fontSize: Fonts.sizes.md,
    color: Colors.darkGray,
    lineHeight: 24,
  },
  serviceCard: {
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.gold,
    gap: 4,
  },
  serviceDay: {
    fontSize: Fonts.sizes.md,
    color: Colors.deepBlue,
    fontWeight: '700',
  },
  serviceTime: {
    fontSize: Fonts.sizes.sm,
    color: Colors.darkGray,
  },
  serviceLocation: {
    fontSize: Fonts.sizes.sm,
    color: Colors.mediumGray,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    gap: Spacing.md,
  },
  infoIcon: {
    fontSize: 22,
    width: 30,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.mediumGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: Fonts.sizes.md,
    color: Colors.darkGray,
    fontWeight: '500',
    marginTop: 2,
  },
  infoLink: {
    color: Colors.deepBlue,
    textDecorationLine: 'underline',
  },
  ctaBtn: {
    backgroundColor: Colors.deepBlue,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadow.button,
  },
  ctaText: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
