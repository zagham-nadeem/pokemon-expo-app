import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { PokemonDetail, Type } from "../types/types";

export default function Details() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [pokemonDetail, setPokemonDetail] =
    React.useState<PokemonDetail | null>(null);
  const [selectedTab, setSelectedTab] = React.useState("forms");
  const [loading, setLoading] = React.useState(true);

  const pokemonId = params.id as string;
  const pokemonName = params.name as string;
  const pokemonImage = params.image as string;
  const types = params.types ? JSON.parse(params.types as string) : [];

  React.useEffect(() => {
    fetchPokemonDetail();
  }, [pokemonId]);

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

  const getBackgroundColor = (types: Type[]) => {
    if (types.length > 0) {
      return colorsByType[types[0].type.name] || "#A8A77A";
    }
    return "#A8A77A";
  };

  const bgColor = getBackgroundColor(types);

  async function fetchPokemonDetail() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      const data: PokemonDetail = await response.json();
      setPokemonDetail(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !pokemonDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3d5a80" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `${
            pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
          }`,
          headerStyle: { backgroundColor: bgColor },
          headerTintColor: "white",
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Pokemon Image Card */}
          <View style={[styles.imageCard, { backgroundColor: bgColor }]}>
            <Image source={{ uri: pokemonImage }} style={styles.pokemonImage} />
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "forms" && styles.activeTab]}
              onPress={() => setSelectedTab("forms")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "forms" && styles.activeTabText,
                ]}
              >
                Forms
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "detail" && styles.activeTab]}
              onPress={() => setSelectedTab("detail")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "detail" && styles.activeTabText,
                ]}
              >
                Detail
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "types" && styles.activeTab]}
              onPress={() => setSelectedTab("types")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "types" && styles.activeTabText,
                ]}
              >
                Types
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "stats" && styles.activeTab]}
              onPress={() => setSelectedTab("stats")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "stats" && styles.activeTabText,
                ]}
              >
                Stats
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "weak" && styles.activeTab]}
              onPress={() => setSelectedTab("weak")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "weak" && styles.activeTabText,
                ]}
              >
                Weak
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {selectedTab === "forms" && (
            <View style={styles.contentContainer}>
              <Text style={styles.sectionTitle}>Mega Evolution</Text>
              <View style={styles.formsContainer}>
                {pokemonDetail.forms.map((form, index) => (
                  <View
                    key={index}
                    style={[styles.formCard, { backgroundColor: bgColor }]}
                  >
                    <Image
                      source={{ uri: pokemonImage }}
                      style={styles.formImage}
                    />
                  </View>
                ))}
              </View>
              <Text style={styles.descriptionText}>
                In order to support its flower, which has grown larger due to
                Mega Evolution, its back and legs have become stronger.
              </Text>
            </View>
          )}

          {selectedTab === "detail" && (
            <View style={styles.contentContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Height</Text>
                <Text style={styles.detailValue}>
                  {(pokemonDetail.height / 10).toFixed(1)} m
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Weight</Text>
                <Text style={styles.detailValue}>
                  {(pokemonDetail.weight / 10).toFixed(1)} kg
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Abilities</Text>
                <Text style={styles.detailValue}>
                  {pokemonDetail.abilities
                    .map(
                      (a) =>
                        a.ability.name.charAt(0).toUpperCase() +
                        a.ability.name.slice(1)
                    )
                    .join(", ")}
                </Text>
              </View>
            </View>
          )}

          {selectedTab === "types" && (
            <View style={styles.contentContainer}>
              <View style={styles.typesContainer}>
                {pokemonDetail.types.map((type, index) => (
                  <View
                    key={index}
                    style={[
                      styles.typeChip,
                      {
                        backgroundColor:
                          colorsByType[type.type.name] || "#A8A77A",
                      },
                    ]}
                  >
                    <Text style={styles.typeText}>
                      {type.type.name.charAt(0).toUpperCase() +
                        type.type.name.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedTab === "stats" && (
            <View style={styles.contentContainer}>
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
            </View>
          )}

          {selectedTab === "weak" && (
            <View style={styles.contentContainer}>
              <Text style={styles.descriptionText}>
                Type effectiveness information would be displayed here.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3d5a80",
  },
  headerNumber: {
    fontSize: 16,
    color: "#98a2b3",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  imageCard: {
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  pokemonImage: {
    width: 240,
    height: 240,
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 24,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3d5a80",
  },
  tabText: {
    fontSize: 14,
    color: "#98a2b3",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#3d5a80",
    fontWeight: "600",
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3d5a80",
    marginBottom: 16,
  },
  formsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  formCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  formImage: {
    width: 80,
    height: 80,
  },
  descriptionText: {
    fontSize: 14,
    color: "#667085",
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  detailLabel: {
    fontSize: 16,
    color: "#98a2b3",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    color: "#3d5a80",
    fontWeight: "600",
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  typeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statName: {
    width: 120,
    fontSize: 14,
    color: "#3d5a80",
    fontWeight: "500",
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginHorizontal: 12,
  },
  statBar: {
    height: "100%",
    borderRadius: 4,
  },
  statValue: {
    width: 40,
    textAlign: "right",
    fontSize: 14,
    color: "#3d5a80",
    fontWeight: "600",
  },
});
