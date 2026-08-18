# BTR Ticketing App
**Back to the Root of Worship — Dr. Sarah K Tuesday Worship Ministries**

A mobile ticketing system for the Tuesday Service, built with Expo + React Native.

---

## Features
- **Splash Screen** — animated BTR logo with gold divider, auto-transitions to Home
- **Home Screen** — ministry branding with three main actions
- **Generate Ticket** — issues the next sequential ticket number with a scannable QR code and BTR watermark; ticket is persisted locally
- **My Tickets** — lists all generated tickets with mini QR thumbnails; tap **View** to open a full-screen detail modal with share support
- **About Ministry** — ministry description, service times, and contact info with deep-link support (phone, email, web)

## Tech Stack
| Package | Purpose |
|---|---|
| Expo ~51 | Build & dev tooling |
| React Navigation 6 | Stack navigation |
| react-native-qrcode-svg | QR code generation |
| react-native-svg | Inline SVG logo |
| @react-native-async-storage/async-storage | Persistent ticket storage |
| react-native-safe-area-context | Safe area handling |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start

# 3. Scan the QR with Expo Go (Android / iOS)
#    or press 'a' for Android emulator, 'i' for iOS simulator, 'w' for web
```

## Branding
- **Primary:** Deep Blue `#1A2B5E`
- **Accent:** Gold `#C9A84C`
- **Background:** Off-White `#F5F5F0`

## Project Structure
```
btr-ticketing-app/
├── App.tsx                        # Root component
├── app.json                       # Expo config
├── src/
│   ├── navigation/
│   │   ├── types.ts               # RootStackParamList
│   │   └── AppNavigator.tsx       # Stack navigator
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── GenerateTicketScreen.tsx
│   │   ├── MyTicketsScreen.tsx
│   │   └── AboutMinistryScreen.tsx
│   ├── components/
│   │   └── BTRLogo.tsx            # Inline SVG logo
│   ├── storage/
│   │   └── ticketStore.ts         # AsyncStorage helpers
│   └── theme/
│       └── index.ts               # Colors, Fonts, Spacing
└── assets/                        # App icon placeholder
```

## Future Expansion (per spec)
- USSD interface for non-smartphone users (dial `*123#`, receive ticket via SMS)
- Admin QR scanner for ushers
- Attendance analytics dashboard
