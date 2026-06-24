# FleetTrack — Driver App

A React Native mobile app for truck drivers to manage assigned trips, complete pre-trip safety inspections, and update delivery statuses in real time.

Built with **Expo SDK 54**, **React Native 0.81**, and **TypeScript**.

---

## Prerequisites

Make sure the following are installed on your machine before you begin.

| Tool | Version | Download |
|---|---|---|
| Node.js | 18.x or higher | https://nodejs.org |
| npm | 9.x or higher (comes with Node) | — |
| Git | Any recent version | https://git-scm.com |
| Expo Go (phone) | Latest from App Store / Play Store | — |

To verify your Node and npm versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/trucking-app.git
cd trucking-app
```

### 2. Install dependencies

```bash
npm install
```

This installs all packages listed in `package.json` including Expo, React Navigation, and React Native.

### 3. Start the development server

```bash
npx expo start
```

A QR code will appear in the terminal along with options to open the app.

---

## Running the App

### On your physical phone (Expo Go)

> Your phone and PC must be on the **same Wi-Fi network**.

1. Install **Expo Go** from the Play Store (Android) or App Store (iOS)
2. Run `npx expo start --lan` in the project folder
3. Open Expo Go on your phone and scan the QR code from the terminal

If your phone is on mobile data or a different network, use tunnel mode instead:

```bash
npx expo start --tunnel
```

> Tunnel mode requires a free ngrok account. See the [Tunnel Setup](#tunnel-setup-for-different-networks) section below.

---

### On an Android Emulator

1. Install [Android Studio](https://developer.android.com/studio) and set up an Android Virtual Device (AVD)
2. Start the emulator from Android Studio (or from AVD Manager)
3. Run the dev server:

```bash
npx expo start
```

4. Press **`a`** in the terminal — Expo will install and launch the app on the emulator automatically

---

### On an iOS Simulator (Mac only)

1. Install Xcode from the Mac App Store
2. Run the dev server:

```bash
npx expo start
```

3. Press **`i`** in the terminal to open in the iOS Simulator

---

## npm Scripts

| Script | Command | What it does |
|---|---|---|
| Start dev server | `npm start` | Starts Metro bundler with interactive menu |
| Open on Android | `npm run android` | Starts server and opens Android emulator |
| Open on iOS | `npm run ios` | Starts server and opens iOS simulator (Mac only) |
| Open in browser | `npm run web` | Starts server and opens in web browser |

---

## Tunnel Setup (for different networks)

If your phone cannot reach the PC over Wi-Fi (e.g. phone is on mobile data), use ngrok tunnel mode.

**Step 1** — Sign up for a free account at [ngrok.com](https://ngrok.com)

**Step 2** — Copy your authtoken from the ngrok dashboard

**Step 3** — Register the token on your machine:

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

**Step 4** — Start Expo with tunnel:

```bash
npx expo start --tunnel
```

**Step 5** — Scan the new QR code that appears in the terminal with Expo Go

---

## Windows Firewall (if LAN mode is blocked)

If Expo Go on your phone shows a network error while on the same Wi-Fi, the Windows Firewall may be blocking port 8081.

Open **PowerShell as Administrator** and run:

```powershell
netsh advfirewall firewall add rule name="Expo Metro" dir=in action=allow protocol=TCP localport=8081
```

Then restart the dev server with `npx expo start --lan`.

---

## Project Structure

```
trucking-app/
├── App.tsx                  # Entry point: navigation + global state provider
├── app.json                 # Expo app config
├── package.json
├── tsconfig.json
└── src/
    ├── types/               # TypeScript interfaces (Trip, Truck, Driver, etc.)
    ├── data/                # Mock trip data (no backend needed)
    ├── utils/               # Status colours, ETA formatter, action guards
    ├── services/            # Pure functions for trip operations
    ├── context/             # Global state (TripContext)
    ├── components/          # Reusable UI: TripCard, StatusBadge, PrimaryButton, etc.
    └── screens/             # TripListScreen, TripDetailScreen, PreTripInspectionScreen
```

See [CLAUDE.md](CLAUDE.md) for a full file-by-file breakdown.

---

## App Features

### Trip List Screen
- Shows all assigned trips with status, truck plate, route, and ETA
- Summary card at the top showing total / in-progress / delivered / delayed counts
- Tap any trip card to view full details

### Trip Detail Screen
- Full trip info: truck model, plate, driver, odometer, cargo, distance
- Action buttons change based on trip status:

| Current Status | Available Actions |
|---|---|
| Pending | Start Pre-Trip Inspection |
| Ready to Start | Start Trip |
| In Progress | Mark as Delivered, Report Delay |
| Delivered / Delayed | Reset to Pending |

### Pre-Trip Inspection Screen
- 5-item safety checklist: Tyres, Brakes, Lights, Fuel, Load
- Progress bar fills as items are ticked
- Submit button is disabled until all 5 items are checked
- On submit, trip status updates to **Ready to Start**

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Failed to download remote update` | Phone and PC on different networks — use `--tunnel` |
| `Project is incompatible with this version of Expo Go` | Expo Go SDK mismatch — run `npx expo install --fix` then reinstall |
| Black screen on emulator | Press `a` in the terminal (do not scan QR code manually) |
| `failed to start tunnel / remote gone away` | ngrok auth token not set — follow [Tunnel Setup](#tunnel-setup-for-different-networks) |
| Port 8081 refused on same Wi-Fi | Add Windows Firewall rule for port 8081 (see above) |
| `npm install` peer dep conflict | Run `npm install --legacy-peer-deps` |

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Expo | ~54.0.0 | App runtime and toolchain |
| React Native | 0.81.x | Mobile UI framework |
| React | 19.x | Component model |
| TypeScript | ^5.3.3 | Static typing |
| React Navigation | ^6.x | Stack-based screen routing |
