// src/screens/HomeScreen.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  useWindowDimensions, // 1. Importar o hook de dimensões
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Searchbar,
  Button,
  ActivityIndicator,
  Text,
  DataTable, // 2. Importar o DataTable
  Chip,
} from 'react-native-paper';
import axios from 'axios';

import { Pokemon } from '../types/pokemon';
import { HomeScreenProps } from '../navigation/types';
import PokemonCard from '../components/PokemonCard';
import { typeColors } from '../constants/colors'; // Importar cores

// O limite e total de pokémons
const limit = 9; // 3. Voltamos ao limite de 9 para a paginação da tabela
const TOTAL_POKEMONS = 1025;

// Define um ponto de quebra para o layout
const LAYOUT_BREAKPOINT = 500; // Telas > 500px usarão cards

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  // Hook para pegar as dimensões da tela
  const { width } = useWindowDimensions(); // 4. Pegar a largura da tela

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const pokemonCache = useRef<Map<number, Pokemon>>(new Map());

  // 5. Adaptamos o useEffect para buscar com o offset
  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchPokemons(offset, true);
    }
  }, [offset]); // Agora depende do offset

  const fetchPokemons = async (newOffset: number, clear = false) => {
    if (loading) return;
    setLoading(true);
    setNotFound(false);

    try {
      const lastId = Math.min(newOffset + limit, TOTAL_POKEMONS);
      const ids = Array.from({ length: lastId - newOffset }, (_, i) => i + 1 + newOffset);

      const detailedPokemons: Pokemon[] = await Promise.all(
        ids.map(async (id) => {
          if (pokemonCache.current.has(id)) {
            return pokemonCache.current.get(id)!;
          }

          const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = res.data;

          const speciesRes = await axios.get(data.species.url);
          const flavor = speciesRes.data.flavor_text_entries.find(
            (entry: any) => entry.language.name === 'en'
          );

          const pokemon: Pokemon = {
            ...data,
            description: flavor?.flavor_text.replace(/[\n\f]/g, ' ') || 'No description available.',
          };

          pokemonCache.current.set(id, pokemon);
          return pokemon;
        })
      );

      // 6. Lógica de "clear" para paginação
      // Se for limpar, define os novos. Se não, acumula (para o scroll infinito)
      setPokemons(clear ? detailedPokemons : [...pokemons, ...detailedPokemons]);

    } catch (error) {
      console.error('Erro ao buscar pokémons:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      handleClearSearch();
      return;
    }
    
    setLoading(true);
    setNotFound(false);
    setPokemons([]); // Limpa a lista para exibir só o resultado

    try {
      // 1. Buscamos pela "espécie" (como no seu código original)
      const speciesRes = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${searchTerm.toLowerCase()}`
      );

      // 2. Encontramos a variedade/forma padrão
      const defaultVariety = speciesRes.data.varieties.find(
        (v: any) => v.is_default
      );
      const pokemonUrl = defaultVariety?.pokemon.url;

      if (!pokemonUrl) {
        throw new Error('Forma padrão não encontrada');
      }

      // 3. Buscamos os dados do Pokémon usando a URL da forma padrão
      const res = await axios.get(pokemonUrl);
      const data = res.data; // Este é o { pokemon }

      // 4. Verificamos o cache
      if (pokemonCache.current.has(data.id)) {
         setPokemons([pokemonCache.current.get(data.id)!]);
         // Não precisa de .finally, então paramos o loading aqui
         setLoading(false); 
         return; // Achou no cache, fim
      }

      // 5. Pegamos a descrição (que já veio na busca da espécie)
      const flavor = speciesRes.data.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      );

      const pokemon: Pokemon = {
        ...data,
        description: flavor?.flavor_text.replace(/[\n\f]/g, ' ') || 'No description available.',
      };

      pokemonCache.current.set(pokemon.id, pokemon);
      setPokemons([pokemon]);

    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      setPokemons([]);
      setNotFound(true);
    } finally {
      // O 'finally' só roda se não acharmos no cache
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPokemons([]);
    setOffset(0); // Reseta o offset
    fetchPokemons(0, true);
  };
  
  const handleCardPress = (pokemon: Pokemon) => {
    navigation.navigate('Details', { pokemon });
  };

  // 7. --- Lógica de Paginação (do seu código original) ---
  const totalPages = Math.ceil(TOTAL_POKEMONS / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  
  const handleNextPage = () => {
    if (offset + limit < TOTAL_POKEMONS) {
      setOffset((prev) => prev + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset((prev) => prev - limit);
    }
  };
  // --- Fim da Lógica de Paginação ---


  // 8. Renderizador da Tabela (Tela Pequena)
  const renderTable = () => (
    <ScrollView>
      <DataTable>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title style={{ flex: 1.5 }}>Sprite</DataTable.Title>
          <DataTable.Title style={{ flex: 3 }}>Nome</DataTable.Title>
          <DataTable.Title style={{ flex: 4 }}>Tipo</DataTable.Title>
        </DataTable.Header>

        {loading && pokemons.length === 0 ? (
          <ActivityIndicator animating={true} size="large" style={styles.spinner} />
        ) : (
          pokemons.map((pokemon) => (
            <DataTable.Row
              key={pokemon.id}
              onPress={() => handleCardPress(pokemon)}
            >
              <DataTable.Cell style={{ flex: 1.5 }}>
                <Image
                  source={{ uri: pokemon.sprites.front_default }}
                  style={styles.sprite}
                />
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 3 }}>
                <Text style={styles.tableName}>
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 4 }}>
                <View style={styles.typesContainer}>
                  {pokemon.types.map((t, index) => (
                    <Chip
                      key={index}
                      style={[
                        styles.chip,
                        { backgroundColor: typeColors[t.type.name] || '#777' },
                      ]}
                      textStyle={styles.chipText}
                    >
                      {t.type.name}
                    </Chip>
                  ))}
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          ))
        )}
      </DataTable>

      {/* Paginação da Tabela */}
      {!notFound && pokemons.length > 1 && (
        <View style={styles.paginationContainer}>
          <Button
            mode="contained"
            onPress={handlePrevPage}
            disabled={offset === 0 || loading}
          >
            Anterior
          </Button>
          <Text style={styles.pageInfo}>
            {currentPage} / {totalPages}
          </Text>
          <Button
            mode="contained"
            onPress={handleNextPage}
            disabled={offset + limit >= TOTAL_POKEMONS || loading}
          >
            Próximo
          </Button>
        </View>
      )}
    </ScrollView>
  );

  // 9. Renderizador dos Cards (Tela Grande)
  const renderCards = () => (
    <FlatList
      data={pokemons}
      renderItem={({ item }) => (
        <PokemonCard pokemon={item} onPress={() => handleCardPress(item)} />
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        // Scroll infinito SÓ funciona no modo card e se não for busca
        if (
          offset + limit < TOTAL_POKEMONS &&
          pokemons.length >= limit &&
          !loading &&
          !searchTerm.trim()
        ) {
          // No modo card, usamos o offset atual para buscar mais
          const nextOffset = offset + pokemons.length;
          fetchPokemons(nextOffset);
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? (
          <ActivityIndicator animating={true} size="large" style={styles.spinner} />
        ) : null
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar Pokémon"
          onChangeText={setSearchTerm}
          value={searchTerm}
          onSubmitEditing={handleSearch}
          onClearIconPress={handleClearSearch}
          style={styles.searchbar}
        />
      </View>

      {notFound && (
        <Text style={styles.notFoundText}>Pokémon não encontrado.</Text>
      )}

      {/* 10. Renderização Condicional */}
      {width < LAYOUT_BREAKPOINT ? renderTable() : renderCards()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchbar: {
    marginBottom: 10,
  },
  // Estilos dos Cards
  list: {
    paddingHorizontal: 5,
  },
  // Estilos da Tabela
  tableHeader: {
    backgroundColor: '#eee',
  },
  sprite: {
    width: 50,
    height: 50,
  },
  tableName: {
    textTransform: 'capitalize',
    fontSize: 14,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  // Estilos Comuns
  notFoundText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
  spinner: {
    marginVertical: 20,
  },
  // Estilos da Paginação da Tabela
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;