import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import BTRLogo from '../components/BTRLogo';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

interface NavButtonProps {
  label: string;
  onPress: () => void;
  primary?: boolean;
}

function NavButton({ label, onPress, primary }: NavButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, primary && styles.buttonPrimary]}
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.buttonText, primary && styles.buttonTextPrimary]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.deepBlue} />

      {/* Header strip */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dr. Sarah K</Text>
        <Text style={styles.headerSubtitle}>Tuesday Worship Ministries</Text>
      </View>

      {/* Hero card */}
      <View style={styles.heroCard}>
        {/* Background pattern: faint cross */}
        <View style={styles.bgPattern} />

        <BTRLogo size={130} color={Colors.deepBlue} bgColor="transparent" />

        <View style={styles.divider} />

        <Text style={styles.heroTitle}>Back the</Text>
        <Text style={styles.heroTitleBold}>ROOT OF WORSHIP</Text>
        <Text style={styles.heroSub}>Tuesday Service</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <NavButton
          label="Generate Ticket"
          onPress={() => navigation.navigate('GenerateTicket')}
          primary
        />
        <NavButton
          label="My Tickets"
          onPress={() => navigation.navigate('MyTickets')}
        />
        <NavButton
          label="About Ministry"
          onPress={() => navigation.navigate('AboutMinistry')}
        />
      </View>

      {/* Gold bottom bar */}
      <View style={styles.bottomBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  header: {
    backgroundColor: Colors.deepBlue,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: Colors.gold,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.heading,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: Colors.gold,
    fontSize: Fonts.sizes.sm,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  bgPattern: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 30,
    borderColor: 'rgba(26,43,94,0.04)',
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    marginVertical: Spacing.md,
  },
  heroTitle: {
    color: Colors.darkGray,
    fontSize: Fonts.sizes.md,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: Fonts.heading,
  },
  heroTitleBold: {
    color: Colors.deepBlue,
    fontSize: Fonts.sizes.xl,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: Fonts.heading,
    marginTop: 2,
  },
  heroSub: {
    color: Colors.gold,
    fontSize: Fonts.sizes.sm,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },
  actions: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  button: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.deepBlue,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
  },
  buttonPrimary: {
    backgroundColor: Colors.deepBlue,
    borderColor: Colors.deepBlue,
    ...Shadow.button,
  },
  buttonText: {
    color: Colors.deepBlue,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonTextPrimary: {
    color: Colors.white,
  },
  bottomBar: {
    height: 4,
    backgroundColor: Colors.gold,
  },
});
