import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import BTRLogo from '../components/BTRLogo';
import { Colors, Fonts, Spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: Props) {
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  // useNativeDriver: false is not supported on web, so on web we skip the
  // width animation and just show the divider at full width immediately.
  const lineWidth = useRef(
    new Animated.Value(Platform.OS === 'web' ? width * 0.55 : 0),
  ).current;

  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web: animate only properties that support useNativeDriver: true
      Animated.sequence([
        Animated.parallel([
          Animated.spring(logoScale, {
            toValue: 1,
            tension: 60,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // On native: full sequence including the width animation
      Animated.sequence([
        Animated.parallel([
          Animated.spring(logoScale, {
            toValue: 1,
            tension: 60,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        // Gold divider line grows
        Animated.timing(lineWidth, {
          toValue: width * 0.55,
          duration: 500,
          useNativeDriver: false,
        }),
        // Text fades in
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Navigate to Home after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.deepBlue} />

      {/* Gold decorative top bar */}
      <View style={styles.topAccent} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <BTRLogo size={140} color={Colors.gold} bgColor="transparent" />
      </Animated.View>

      {/* Gold divider */}
      <Animated.View style={[styles.divider, { width: lineWidth }]} />

      {/* Ministry name */}
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text style={styles.title}>Back to the</Text>
        <Text style={styles.titleBold}>Root of Worship</Text>
        <View style={styles.taglineBox}>
          <Text style={styles.tagline}>Tuesday Service</Text>
        </View>
        <Text style={styles.ministry}>Dr. Sarah K Tuesday Worship Ministries</Text>
      </Animated.View>

      {/* Bottom accent */}
      <View style={styles.bottomAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: Colors.gold,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: Colors.gold,
  },
  logoContainer: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  divider: {
    height: 2,
    backgroundColor: Colors.gold,
    marginVertical: Spacing.lg,
    borderRadius: 2,
  },
  title: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.heading,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  titleBold: {
    color: Colors.gold,
    fontSize: Fonts.sizes.xxl,
    fontFamily: Fonts.heading,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  taglineBox: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
  },
  tagline: {
    color: Colors.gold,
    fontSize: Fonts.sizes.md,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  ministry: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    marginTop: Spacing.lg,
    opacity: 0.65,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
