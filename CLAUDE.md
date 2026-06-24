# FleetTrack — Codebase Structure

A React Native (Expo SDK 54) mobile app for truck drivers to manage trips, run pre-trip inspections, and update delivery statuses. Built with TypeScript, functional components, and React hooks only — no third-party state library required.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Expo | ~54.0.0 | App runtime and tooling |
| React Native | 0.76.9 | Mobile UI framework |
| React | 18.3.1 | Component model |
| TypeScript | ^5.3.3 | Static typing |
| React Navigation (Native Stack) | ^6.x | Screen routing |

---

## Folder Structure

```
trucking-app/
├── App.tsx                          # Root: Navigation + TripProvider wrapper
├── app.json                         # Expo config (app name, bundle IDs)
├── package.json
├── tsconfig.json
├── babel.config.js
├── CLAUDE.md                      # This file
│
└── src/
    ├── types/
    │   └── index.ts                 # All TypeScript interfaces and union types
    │
    ├── data/
    │   └── mockData.ts              # Static mock trips and inspection items
    │
    ├── utils/
    │   └── statusHelpers.ts         # Status colours, ETA formatter, action guards
    │
    ├── services/
    │   └── tripService.ts           # Pure functions for trip state operations
    │
    ├── context/
    │   └── TripContext.tsx          # Global state: trips array + update functions
    │
    ├── components/
    │   ├── TripCard.tsx             # List card showing trip summary
    │   ├── StatusBadge.tsx          # Colour-coded status pill
    │   ├── ChecklistItem.tsx        # Tap-to-toggle inspection row
    │   ├── PrimaryButton.tsx        # Themed action button (4 variants)
    │   └── SummaryCard.tsx          # Dashboard overview tile (4 stats)
    │
    └── screens/
        ├── TripListScreen.tsx       # Home: FlatList of trips + SummaryCard
        ├── TripDetailScreen.tsx     # Full trip info + status action buttons
        └── PreTripInspectionScreen.tsx  # Checklist with progress bar + submit
```

---

## File-by-File Reference

### `App.tsx`
The app entry point. Wraps the entire navigation tree inside `<TripProvider>` so all screens share the same trip state. Uses a `NativeStackNavigator` with three routes. The `TripList` screen hides the header (it has a custom one); the other two screens use the standard navy header.

---

### `src/types/index.ts`
Single source of truth for all data shapes and route params.

```
TripStatus   — union: 'Pending' | 'Ready to Start' | 'In Progress' | 'Delivered' | 'Delayed'
Driver       — id, name, licenseNumber, phone
Truck        — id, plateNumber, model, year, odometer, loadType
InspectionItem — id, label, checked
Trip         — id, driver, truck, locations, eta, status, cargo, distance, timestamps
RootStackParamList — navigation param types for all three screens
```

Adding a new status (e.g. `'At Customs'`) here automatically surfaces TypeScript errors in every file that needs updating, making the union type a compile-time safeguard.

---

### `src/data/mockData.ts`
Exports two constants:

- `MOCK_TRIPS` — array of 4 `Trip` objects covering every possible status (Pending, In Progress, Delivered, Delayed), each with a distinct truck and realistic Philippine route data.
- `DEFAULT_INSPECTION_ITEMS` — array of 5 `InspectionItem` objects, all `checked: false`, used as the starting state for every inspection session.

This is the only file that needs to change when switching to a real API — replace static arrays with `fetch` calls and nothing else changes.

---

### `src/utils/statusHelpers.ts`
Pure utility functions with no side effects.

| Export | Purpose |
|---|---|
| `STATUS_COLORS` | Maps each `TripStatus` to a `{ bg, text }` colour pair used by `StatusBadge` |
| `formatETA(iso)` | Converts ISO date string to a readable `"Jun 24, 02:30 PM"` format |
| `canInspect(status)` | Returns `true` only for `'Pending'` |
| `canStartTrip(status)` | Returns `true` only for `'Ready to Start'` |
| `canDeliver(status)` | Returns `true` only for `'In Progress'` |
| `canReportDelay(status)` | Returns `true` only for `'In Progress'` |

The `can*` guards centralise all business logic for which actions are available at each stage. `TripDetailScreen` calls these to decide which buttons to render — the button visibility is derived, never imperative.

---

### `src/services/tripService.ts`
Pure functions that operate on the trips array. They take data in, return new data out — no React, no side effects, fully testable without mocking.

| Export | Purpose |
|---|---|
| `updateTripStatus(trips, tripId, newStatus, extra?)` | Returns a new array with one trip's status replaced (immutable) |
| `getTripById(trips, tripId)` | Finds and returns a single trip by ID |
| `getSummary(trips)` | Returns `{ total, inProgress, delivered, delayed }` counts |

**API migration path:** When a real backend exists, add async versions of these functions alongside the pure ones. The context calls the service; the screens never touch the service directly.

---

### `src/context/TripContext.tsx`
Global state container built with `useContext` + `useState`. Holds the `trips` array and exposes two mutators:

| Function | What it does |
|---|---|
| `updateStatus(tripId, status, extra?)` | Calls `updateTripStatus` from the service layer and sets state |
| `markInspectionComplete(tripId)` | Sets `inspectionCompleted: true` and status to `'Ready to Start'` |

Any component inside `<TripProvider>` can call `useTripContext()` to read or update trips. State changes re-render all subscribing screens automatically.

---

### `src/components/StatusBadge.tsx`
Renders a small rounded pill with background and text colour derived from `STATUS_COLORS`. Accepts a single `status: TripStatus` prop. Used in both `TripCard` and `TripDetailScreen`.

---

### `src/components/PrimaryButton.tsx`
A styled `TouchableOpacity` with four colour variants:

| Variant | Colour | Used for |
|---|---|---|
| `primary` | Navy `#1A3C5E` | Navigation actions |
| `success` | Green `#16A34A` | Start Trip, Mark Delivered |
| `warning` | Amber `#D97706` | Report Delay |
| `danger` | Red `#DC2626` | Destructive actions |

`disabled` prop turns the button grey and blocks `onPress`. `loading` prop shows an `ActivityIndicator` instead of the label.

---

### `src/components/ChecklistItem.tsx`
A single inspection row rendered as a `TouchableOpacity`. Tapping calls `onToggle(id)` which the parent screen uses to flip `checked` in its local state. When checked, the box turns green and the label gets a strikethrough. State lives in `PreTripInspectionScreen`, not inside this component, keeping it purely presentational.

---

### `src/components/TripCard.tsx`
The list row component used in `TripListScreen`. Renders:
- Trip ID and `StatusBadge`
- Truck plate chip
- Route visualiser (blue dot → line → orange dot)
- Cargo description and ETA

Accepts `trip` and `onPress` props only. All formatting logic is delegated to `statusHelpers`.

---

### `src/components/SummaryCard.tsx`
A dark navy tile displayed at the top of `TripListScreen`. Shows four statistics: Total, In Progress, Delivered, Delayed — each with a distinct accent colour. Receives pre-computed numbers as props (computed by `getSummary` inside the screen using `useMemo`).

---

### `src/screens/TripListScreen.tsx`
The home screen. Uses `FlatList` (not `ScrollView + map`) for performance on large trip lists. `SummaryCard` is passed as `ListHeaderComponent` so it scrolls with the list naturally. Summary counts are wrapped in `useMemo` to avoid recalculating on every render.

---

### `src/screens/TripDetailScreen.tsx`
Shows full trip details in two cards (Truck & Driver, Cargo Details) and renders action buttons conditionally using the `can*` guards:

```
Pending        →  "Start Pre-Trip Inspection"  (navigates to PreTripInspection)
Ready to Start →  "Start Trip"                 (sets status to In Progress)
In Progress    →  "Mark as Delivered"           (Alert confirm → sets Delivered)
               +  "Report Delay"               (Alert confirm → sets Delayed)
Delivered      →  no actions
Delayed        →  no actions
```

Reads `tripId` from `route.params`, looks up the live trip from context (not from params) so status changes on other screens are always reflected here.

---

### `src/screens/PreTripInspectionScreen.tsx`
Manages a local `InspectionItem[]` state (fresh copy on every mount — each visit starts unchecked). Derives two values from that state:

- `checkedCount` — drives the progress bar width and counter label
- `allChecked` — enables/disables the submit button

On submit, calls `markInspectionComplete(tripId)` from context and navigates back. The submit button label also changes: shows remaining item count while incomplete, "Submit Inspection" when all done.

---

## Data Flow Diagram

```
App.tsx
└── TripProvider (holds trips[] in useState)
    └── NavigationContainer
        ├── TripListScreen
        │     reads: trips[] via useTripContext()
        │     computes: summary via useMemo → getSummary()
        │     renders: SummaryCard + FlatList of TripCards
        │
        ├── TripDetailScreen
        │     reads: single trip via getTripById()
        │     calls: updateStatus() on button press
        │     gates: buttons via canInspect / canStartTrip / canDeliver / canReportDelay
        │
        └── PreTripInspectionScreen
              local state: InspectionItem[] (fresh on mount)
              calls: markInspectionComplete() on submit
              derives: progress bar + button state from local checkedCount
```

---

## Trip Status Lifecycle

```
[Pending]
    │
    │  Driver taps "Start Pre-Trip Inspection"
    │  Completes all 5 checklist items
    ▼
[Ready to Start]
    │
    │  Driver taps "Start Trip"
    ▼
[In Progress] ──── Driver taps "Report Delay" ───▶ [Delayed]
    │
    │  Driver taps "Mark as Delivered"
    ▼
[Delivered]
```

`Delivered` and `Delayed` are terminal states — no further action buttons are shown.

---

## Reusable Component Props Summary

```typescript
<TripCard       trip={Trip}          onPress={() => void}                          />
<StatusBadge    status={TripStatus}                                                 />
<PrimaryButton  label={string}       onPress={() => void}
                variant?="primary"   disabled?={boolean}   loading?={boolean}      />
<ChecklistItem  item={InspectionItem} onToggle={(id: string) => void}              />
<SummaryCard    total={number}       inProgress={number}
                delivered={number}   delayed={number}                              />
```

---

## How to Run

```bash
# Install dependencies
npm install

# Start with tunnel (different networks)
npx expo start --tunnel

# Start on LAN (phone and PC on same WiFi)
npx expo start --lan

# Open directly in Android emulator
npx expo start
# then press 'a' in terminal
```

---

## Extending to a Real API

The only file to change is `src/services/tripService.ts`. Add async counterparts:

```typescript
// Example: replace mock lookup with a real fetch
export const fetchTrips = async (): Promise<Trip[]> => {
  const res = await fetch('https://api.fleettrack.com/trips', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};
```

Then update `TripContext` to call `fetchTrips()` inside a `useEffect` on mount. No screen or component file needs to change.

Other natural extensions:
- **React Query / SWR** — server state caching and background refresh
- **expo-location** — live GPS tracking while trip is In Progress
- **expo-image-picker** — photo proof of delivery
- **expo-notifications** — push alerts for new trip assignments
- **AsyncStorage / expo-sqlite** — offline queue for status updates
