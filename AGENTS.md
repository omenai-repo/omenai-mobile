You are a senior React Native engineer helping build Omenai.
Write clean, simple, maintainable code. Prioritize clarity over unnecessary abstraction.
Think like a senior mobile developer; implement like someone building an artwork marketplace.

---

## Project Overview

Omenai is an artwork marketplace where artists and galleries market and sell work, and collectors discover and buy art.

Major areas: home/overview, events, gallery dashboard, artwork purchase and orders, search, role-based auth (collector, gallery, artist) with biometrics, artworks listing, profile, support tickets, artist wallet and price reviews, gallery subscriptions, shows/fairs/events, artist roster, payouts.

---

## Tech Stack

- React Native (Expo)
- TypeScript (strict)
- Stripe and Flutterwave
- Expo Secure Store for secrets
- Zustand for global state
- Appwrite for images
- Firebase for monitoring and forced updates
- twrnc for styling (`import tw from "twrnc"`)
- Vexo for analytics

Do not introduce new major libraries unless there is a strong reason.
Ask before installing anything new.

---

## Development Philosophy

1. Read this file before every feature.
2. Keep implementations simple; avoid overengineering.
3. Prefer readable code over clever code.
4. Ship the smallest useful version first.
5. Refactor when repetition appears, not preemptively.

---

## Decision Making

If something is unclear or could be improved, suggest a better
approach. If a new library would significantly help, recommend it,
explain why, and ask before adding it.
Do not install new libraries without approval.
---

## Repository Layout

Top-level folders and their roles:

```
screens/        # Route-level UI only — thin orchestrators
components/     # Shared, reusable UI (2+ screens or clear shared concept)
features/       # Cross-cutting feature logic without screens (e.g. deeplink)
services/       # API and external IO (fetch, mutations, third-party calls)
config/         # App configuration (colors, Appwrite, feature flags) — no secrets
providers/      # React context providers
store/          # Zustand stores
hooks/          # Shared hooks used across screens/features
lib/            # Pure helpers, validators, storage utilities
constants/      # Static app constants (screen names, images registry, plans)
data/           # Large static datasets (typed)
types/          # Shared TypeScript types
utils/          # App utilities (formatters, query keys, SVG helpers)
navigation/     # Navigators, stacks, tab bars
assets/         # Images, fonts, Lottie — never import directly in screens/components
json/           # Legacy/static JSON blobs (prefer data/ for new work)
```

**Not in AGENTS but present:** `navigation/`, `utils/`, `json/`, root `appWrite_config`, `firebaseConfig` — use existing `#` aliases (see below).

---

## Path Aliases

Always use `#` aliases from `tsconfig.json` / `babel.config.js`. Do not use deep relative paths like `../../../components`.

| Alias | Folder |
|-------|--------|
| `#screens/*` | `screens/` |
| `#components/*` | `components/` |
| `#features/*` | `features/` |
| `#services/*` | `services/` |
| `#config/*` | `config/` |
| `#constants/*` | `constants/` |
| `#hooks/*` | `hooks/` |
| `#lib/*` | `lib/` |
| `#store/*` | `store/` |
| `#types/*` | `types/` |
| `#utils/*` | `utils/` |
| `#data/*` | `data/` |
| `#assets/*` | `assets/` |
| `#providers/*` | `providers/` |
| `#navigation/*` | `navigation/` |

---

## Screens vs Components vs Features

### `screens/` — orchestrators only

- One primary screen file per route (e.g. `screens/home/Home.tsx`).
- Compose UI from `#components/*` and **screen-local** pieces under `screens/<feature>/components/`.
- Wire navigation, Zustand, and shared hooks (`#hooks/*`).
- **Avoid:** large reusable UI blocks, direct `fetch`/API logic, files over **300 lines** (split instead).

```tsx
// screens/home/Home.tsx — good
export default function Home() {
  const { userSession } = useAppStore();
  const onRefresh = useHomeRefresh(userSession?.id);
  return (
    <ScrollWrapper refreshControl={...}>
      <FeaturedFeed />
      <NewArtworksListing />
    </ScrollWrapper>
  );
}
```

### `screens/<feature>/components/` — screen-private UI

Use when the UI is **only** used inside that screen’s feature folder (e.g. `screens/home/components/TrendingArtworks.tsx`).

- Keep presentational; pass data via props.
- **Promote** to `#components/<domain>/` when the same UI is needed in a second screen or feature area.

### `components/` — shared UI

Create a shared component when:

- It is used in **two or more** screens/features, or
- It is a clear, reusable UI concept (buttons, cards, modals, filters).

Organize by domain: `components/artwork/`, `components/orders/`, `components/buttons/`, etc.

Do **not** create shared components prematurely for one-off screen layout.

### `features/` — logic without a screen

For cross-cutting modules that are not a React screen (e.g. `features/deeplink/deepLink.ts`).

- Parsing, routing helpers, feature-specific pure functions.
- **Not** for screen files or large UI trees.

### `services/` — data layer

All HTTP/Appwrite/Stripe calls live here. Screens and hooks call services; screens do not embed API URLs or raw fetch.

### `hooks/` — shared behavior

Extract hooks when logic is reused or when a screen file grows past ~150 lines of state/effects.

Screen-only hooks under 30 lines may stay next to the screen if used nowhere else.

---

## State Management

- **Zustand** in `#store/<domain>/`.
- Prefer MMKV for new persisted stores when adding persistence; some legacy stores still use AsyncStorage.
- Screens read/write via store hooks; avoid duplicating global state in component state.

---

## Images

All raster assets used in UI must be registered in `constants/images.constants.ts`.

```ts
// constants/images.constants.ts
import omenaiAvatar from "#assets/images/omenai-avatar.png";

export const images = {
  omenaiAvatar,
  // ...
};
```

```tsx
import { images } from "#constants/images.constants";

<Image source={images.omenaiAvatar} />
```

Do **not** import from `#assets/` or relative `assets/` paths inside `screens/` or `components/`.

Lottie JSON files use the same pattern via `constants/animations.constants.ts`:

```ts
import { animations } from "#constants/animations.constants";

<LottieView source={animations.loader} />
```

---

## Styling

Use **twrnc** everywhere except the Style Exception List:

- `KeyboardAvoidingView` behavior
- `Modal` visibility/transparency
- `Animated.View` animated values
- Runtime-calculated dynamic styles
- Platform-specific styles
- Pressable pressed states
- Shadows that differ per platform

Reuse shared style patterns; check `package.json` for the installed twrnc version before changing APIs.

---

## UI Rules

When a design is provided: match layout, spacing, typography, colors, radius, shadows, and alignment exactly. Do not approximate unless asked.

---

## File Size (300 LOC)

Every `.ts` / `.tsx` file must stay under **300 lines**. When splitting:

| What grew too large | Split into |
|---------------------|------------|
| Screen | Thinner `screens/.../Screen.tsx` + `screens/.../components/*` or `#components/*` |
| Shared component | Smaller pieces under `components/<domain>/` |
| Hook / store | `#hooks/*` or `#store/*` + `#lib/*` helpers |
| Service | Multiple functions/files under `services/<domain>/` |
| Constants / data | `#constants/*` or `#data/*` |

---

## Feature Checklist

1. Read this file.
2. Identify folders to touch (`screens`, `components`, `services`, etc.).
3. Keep the diff focused; follow existing patterns in that feature.
4. Use `#` imports and centralized images.
5. Verify types and run lint.
6. Test the flow end to end.

---

## Secrets

Never commit API keys or secrets in client code. Use env + EAS secrets; server-side routes for sensitive tokens when applicable.

---

## Communication

Be concise: what changed, why, and how to test.
