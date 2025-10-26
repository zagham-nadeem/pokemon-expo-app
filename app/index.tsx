import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Pokemon, PokemonDetail, Root } from "../types/types";

export default function Index() {
  const [pokemons, setPokemons] = React.useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = React.useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchPokemons();
  }, []);

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

  async function fetchPokemons() {
    try {
      setLoading(true);
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=151"
      );
      const data: Root = await response.json();

      // Fetch detailed info for each Pokémon in parallel
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

  const getBackgroundColor = (types: Pokemon["types"]) => {
    if (types.length > 0) {
      return colorsByType[types[0].type.name] || "#A8A77A";
    }
    return "#A8A77A";
  };

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
            types: JSON.stringify(item.types),
          },
        }}
        asChild
      >
        <TouchableOpacity
          style={{
            backgroundColor: bgColor,
            borderRadius: 16,
            padding: 20,
            alignItems: "center",
            shadowColor: "#000",
            width: "48%",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Image source={{ uri: item.image }} style={styles.pokemonImage} />
          <Text style={styles.pokemonName}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>
          <Text style={styles.pokemonNumber}>
            {item.id.toString().padStart(3, "0")}
          </Text>
        </TouchableOpacity>
      </Link>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3d5a80" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="#98a2b3"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Name or number"
          placeholderTextColor="#98a2b3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPokemons}
        renderItem={renderPokemonCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#3d5a80",
  },
  filterButton: {
    backgroundColor: "#5a6c8f",
    padding: 12,
    borderRadius: 8,
    marginLeft: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: "48%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3d5a80",
    textAlign: "center",
    marginBottom: 4,
  },
  pokemonNumber: {
    fontSize: 14,
    color: "#667085",
    fontWeight: "500",
  },
});
