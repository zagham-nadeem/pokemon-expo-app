# Building a Pokédex App with React Native & Expo Router

A comprehensive guide to creating a beautiful Pokédex application using React Native, Expo Router, and the PokéAPI.

![Pokédex App](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Navigation & Data Passing](#navigation--data-passing)
- [Styling & Theming](#styling--theming)
- [Installation](#installation)
- [Running the App](#running-the-app)

---

## 🎯 Overview

This project demonstrates how to build a production-ready Pokédex application that fetches data from the [PokéAPI](https://pokeapi.co/), implements smooth navigation between screens, and displays Pokémon information in an elegant, user-friendly interface.

The app showcases:
- Real-time API data fetching
- Type-safe TypeScript implementation
- File-based routing with Expo Router
- Dynamic theming based on Pokémon types
- Search functionality
- Modal presentations with sheet detents

---

## ✨ Features

### 🏠 Home Screen (Pokédex List)
- **Grid Layout**: 2-column grid displaying 151 Pokémon
- **Search Functionality**: Search by name or Pokédex number
- **Type-based Coloring**: Each card displays the primary type color
- **Official Artwork**: High-quality Pokémon images from the API
- **Loading States**: Smooth loading indicators

### 📱 Detail Screen
- **Modal Presentation**: Slides up as a modal with adjustable sheet detents
- **Dynamic Header**: Shows Pokémon name with type-colored background
- **Tabbed Interface**: 5 tabs (Forms, Detail, Types, Stats, Weak)
- **Comprehensive Data**: Height, weight, abilities, stats, and more
- **Visual Stats**: Animated stat bars showing base stats

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile framework |
| **Expo** | Development platform and tooling |
| **Expo Router** | File-based navigation system |
| **TypeScript** | Type safety and better DX |
| **PokéAPI** | REST API for Pokémon data |

---

## 📁 Project Structure

```
pokemon/
├── app/
│   ├── _layout.tsx          # Root navigation layout
│   ├── index.tsx            # Home screen (Pokédex list)
│   └── details.tsx          # Detail screen (Pokémon info)
├── types/
│   └── types.ts             # TypeScript interfaces
├── assets/
│   └── images/              # Static assets
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── README.md                # This file
```

---

## 🌐 API Integration

### Understanding the PokéAPI

The [PokéAPI](https://pokeapi.co/) is a free, RESTful API that provides comprehensive Pokémon data. Our app uses two main endpoints:

#### 1. **List Endpoint** - Getting all Pokémon

```typescript
GET https://pokeapi.co/api/v2/pokemon/?limit=151
```

**Response Structure:**
```typescript
{
  count: 1302,
  next: "https://pokeapi.co/api/v2/pokemon/?offset=151&limit=151",
  previous: null,
  results: [
    {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon/1/"
    },
    // ... more Pokémon
  ]
}
```

#### 2. **Detail Endpoint** - Getting specific Pokémon data

```typescript
GET https://pokeapi.co/api/v2/pokemon/{id}
```

**Response Structure:**
```typescript
{
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  sprites: {
    front_default: "https://...",
    other: {
      "official-artwork": {
        front_default: "https://..."
      }
    }
  },
  types: [
    {
      slot: 1,
      type: {
        name: "grass",
        url: "https://..."
      }
    }
  ],
  stats: [...],
  abilities: [...]
}
```

### Implementation in `index.tsx`

#### Step 1: Type Definitions

First, we define TypeScript interfaces for type safety:

```typescript
// types/types.ts
export interface Root {
  count: number;
  next: string;
  previous: any;
  results: Result[];
}

export interface Result {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: Sprites;
  types: Type[];
  height: number;
  weight: number;
  abilities: Ability[];
  stats: Stat[];
  forms: Form[];
}
```

#### Step 2: Fetching Data

We use React's `useEffect` hook to fetch data on component mount:

```typescript
const [pokemons, setPokemons] = React.useState<Pokemon[]>([]);
const [loading, setLoading] = React.useState(true);

React.useEffect(() => {
  fetchPokemons();
}, []);

async function fetchPokemons() {
  try {
    setLoading(true);
    
    // Step 1: Get list of Pokémon
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon/?limit=151"
    );
    const data: Root = await response.json();

    // Step 2: Fetch detailed info for each Pokémon in parallel
    const detailedPokemons = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const details: PokemonDetail = await res.json();
        return {
          id: details.id,
          name: pokemon.name,
          image: details.sprites.other["official-artwork"].front_default,
          imageBack: details.sprites.back_default,
          types: details.types,
        };
      })
    );

    setPokemons(detailedPokemons);
    setFilteredPokemons(detailedPokemons);
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
}
```

**Why `Promise.all`?**
- Instead of fetching Pokémon details one by one (slow), we fetch all 151 in parallel
- This dramatically improves load time from ~151 seconds to just a few seconds
- All requests run concurrently, and we wait for all to complete

---

## 🚀 Navigation & Data Passing

### Expo Router File-Based Navigation

Expo Router uses the file system to define routes. Each file in the `app/` directory becomes a route:

```
app/
├── index.tsx        →  /
└── details.tsx      →  /details
```

### Setting Up Navigation Layout

In `app/_layout.tsx`, we configure the navigation stack:

```typescript
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ title: "Pokemon List" }} 
      />
      <Stack.Screen
        name="details"
        options={{
          headerBackButtonDisplayMode: "minimal",
          presentation: "modal",              // Modal presentation
          sheetAllowedDetents: [0.5, 0.75, 1], // Sheet heights
          sheetGrabberVisible: true,          // Show grab handle
          headerShown: true,
        }}
      />
    </Stack>
  );
}
```

**Key Configuration Options:**
- `presentation: "modal"`: Opens as a bottom sheet modal
- `sheetAllowedDetents`: Defines snap points (50%, 75%, 100% of screen)
- `sheetGrabberVisible`: Shows the drag handle at top of modal

### Passing Data Between Screens

#### Method 1: Using `Link` Component (Recommended)

In `index.tsx`, we use the `Link` component from Expo Router:

```typescript
import { Link } from "expo-router";

const renderPokemonCard = ({ item }: { item: Pokemon }) => {
  const bgColor = getBackgroundColor(item.types);
  
  return (
    <Link
      href={{
        pathname: "/details",
        params: {
          id: item.id,
          name: item.name,
          image: item.image,
          types: JSON.stringify(item.types), // Serialize complex data
        },
      }}
      asChild
    >
      <TouchableOpacity style={{ backgroundColor: bgColor }}>
        <Image source={{ uri: item.image }} />
        <Text>{item.name}</Text>
      </TouchableOpacity>
    </Link>
  );
};
```

**Important Notes:**
- `asChild`: Makes the `Link` use the child component (TouchableOpacity) as its base
- Complex objects (like `types` array) must be serialized with `JSON.stringify`
- All params are passed as strings in the URL

#### Method 2: Receiving Data in Detail Screen

In `details.tsx`, we use `useLocalSearchParams` to access the passed data:

```typescript
import { useLocalSearchParams } from "expo-router";

export default function Details() {
  const params = useLocalSearchParams();
  
  // Extract parameters
  const pokemonId = params.id as string;
  const pokemonName = params.name as string;
  const pokemonImage = params.image as string;
  
  // Parse serialized data
  const types = params.types 
    ? JSON.parse(params.types as string) 
    : [];

  // Fetch additional details
  React.useEffect(() => {
    fetchPokemonDetail();
  }, [pokemonId]);

  async function fetchPokemonDetail() {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const data: PokemonDetail = await response.json();
    setPokemonDetail(data);
  }
}
```

**Data Flow Diagram:**

```
┌─────────────────┐
│   index.tsx     │
│  (List Screen)  │
│                 │
│  - Fetch 151    │
│  - Display grid │
│  - User taps    │
└────────┬────────┘
         │
         │ Link with params:
         │ { id, name, image, types }
         │
         ▼
┌─────────────────┐
│  details.tsx    │
│ (Detail Screen) │
│                 │
│  - Receive      │
│    params       │
│  - Parse types  │
│  - Fetch full   │
│    details      │
└─────────────────┘
```

### Dynamic Header Configuration

We can dynamically set header options in the detail screen:

```typescript
return (
  <>
    <Stack.Screen
      options={{
        title: `${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}`,
        headerStyle: { backgroundColor: bgColor },
        headerTintColor: "white",
      }}
    />
    <View style={styles.container}>
      {/* Screen content */}
    </View>
  </>
);
```

---

## 🎨 Styling & Theming

### Type-Based Color System

Each Pokémon type has a unique color:

```typescript
const colorsByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};
```

### Dynamic Color Application

```typescript
const getBackgroundColor = (types: Type[]) => {
  if (types.length > 0) {
    return colorsByType[types[0].type.name] || "#A8A77A";
  }
  return "#A8A77A";
};

// Usage in component
const bgColor = getBackgroundColor(item.types);

<View style={[styles.card, { backgroundColor: bgColor }]}>
  {/* Card content */}
</View>
```

### Responsive Stat Bars

Stats are displayed as animated bars:

```typescript
{pokemonDetail.stats.map((stat, index) => (
  <View key={index} style={styles.statRow}>
    <Text style={styles.statName}>
      {stat.stat.name.charAt(0).toUpperCase() + 
       stat.stat.name.slice(1).replace("-", " ")}
    </Text>
    <View style={styles.statBarContainer}>
      <View
        style={[
          styles.statBar,
          {
            width: `${(stat.base_stat / 255) * 100}%`,
            backgroundColor: bgColor,
          },
        ]}
      />
    </View>
    <Text style={styles.statValue}>{stat.base_stat}</Text>
  </View>
))}
```

**How it works:**
1. Calculate percentage: `(stat.base_stat / 255) * 100`
2. Apply as width to inner bar
3. Use Pokémon type color for bar

---

## 🔍 Search Implementation

### Real-Time Filtering

```typescript
const [searchQuery, setSearchQuery] = React.useState("");
const [filteredPokemons, setFilteredPokemons] = React.useState<Pokemon[]>([]);

React.useEffect(() => {
  if (searchQuery === "") {
    setFilteredPokemons(pokemons);
  } else {
    const filtered = pokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pokemon.id.toString().padStart(3, "0").includes(searchQuery)
    );
    setFilteredPokemons(filtered);
  }
}, [searchQuery, pokemons]);
```

**Features:**
- Search by name (case-insensitive)
- Search by Pokédex number (with leading zeros)
- Updates in real-time as user types
- No API calls needed (filters local data)

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on device)

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd pokemon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

---

## 🎮 Running the App

### On iOS Simulator
```bash
npm run ios
```

### On Android Emulator
```bash
npm run android
```

### On Physical Device
1. Install **Expo Go** app from App Store or Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

### Web Browser
```bash
npm run web
```

---

## 🏗 Key Concepts Demonstrated

### 1. **Parallel API Requests**
Using `Promise.all()` to fetch multiple resources simultaneously:
```typescript
const detailedPokemons = await Promise.all(
  data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    return await res.json();
  })
);
```

### 2. **Type-Safe Navigation**
TypeScript interfaces ensure data integrity:
```typescript
interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: Type[];
}
```

### 3. **State Management**
Multiple state variables for different concerns:
```typescript
const [pokemons, setPokemons] = React.useState<Pokemon[]>([]);
const [filteredPokemons, setFilteredPokemons] = React.useState<Pokemon[]>([]);
const [searchQuery, setSearchQuery] = React.useState("");
const [loading, setLoading] = React.useState(true);
```

### 4. **Dynamic Styling**
Conditional styles based on data:
```typescript
<View style={[
  styles.card, 
  { backgroundColor: getBackgroundColor(item.types) }
]} />
```

### 5. **Modal Navigation**
iOS-style sheet presentations:
```typescript
<Stack.Screen
  name="details"
  options={{
    presentation: "modal",
    sheetAllowedDetents: [0.5, 0.75, 1],
  }}
/>
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Slow Initial Load
**Problem:** Loading 151 Pokémon takes too long

**Solution:** 
- Use `Promise.all()` for parallel requests ✅
- Consider pagination for larger datasets
- Implement caching with AsyncStorage

### Issue 2: Type Serialization Errors
**Problem:** Can't pass complex objects through navigation params

**Solution:**
```typescript
// Serialize when passing
params: {
  types: JSON.stringify(item.types)
}

// Parse when receiving
const types = JSON.parse(params.types as string);
```

### Issue 3: Images Not Loading
**Problem:** Pokémon images don't display

**Solution:**
- Use official-artwork sprites: `details.sprites.other["official-artwork"].front_default`
- Add error handling for missing images
- Provide fallback placeholder image

---

## 🚀 Future Enhancements

- [ ] Add favorites functionality with AsyncStorage
- [ ] Implement infinite scroll/pagination
- [ ] Add evolution chain display
- [ ] Include move details and animations
- [ ] Add filter by type functionality
- [ ] Implement sound effects
- [ ] Add Pokémon comparison feature
- [ ] Dark mode support
- [ ] Offline mode with caching

---

## 📚 Resources

- [PokéAPI Documentation](https://pokeapi.co/docs/v2)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ using React Native and Expo

---

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing free Pokémon data
- The Pokémon Company for the amazing franchise
- Expo team for excellent tooling

---

**Happy Coding! 🎮✨**
