import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Title, Paragraph, Chip, ProgressBar, MD3Colors } from 'react-native-paper';
import { DetailsScreenProps } from '../navigation/types';
import { typeColors } from '../constants/colors';

const DetailsScreen = ({ route }: DetailsScreenProps) => {
  const { pokemon } = route.params;

  const mainType = pokemon.types[0].type.name;
  const cardColor = typeColors[mainType] || '#777';

  // Capitaliza o nome
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  // Usa a arte oficial
  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: cardColor }]}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        )}
        <Title style={styles.name}>{name}</Title>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
      </View>

      <View style={styles.content}>
        {/* Tipos */}
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

        {/* Descrição */}
        <Title style={styles.subTitle}>Pokedex Entry</Title>
        <Paragraph style={styles.description}>{pokemon.description}</Paragraph>

        {/* Medidas */}
        <View style={styles.measurementsContainer}>
          <View style={styles.measurement}>
            <Title style={styles.measurementText}>{(pokemon.weight / 10).toFixed(1)} kg</Title>
            <Text style={styles.measurementLabel}>Weight</Text>
          </View>
          <View style={styles.measurement}>
            <Title style={styles.measurementText}>{(pokemon.height / 10).toFixed(1)} m</Title>
            <Text style={styles.measurementLabel}>Height</Text>
          </View>
        </View>

        {/* Stats */}
        <Title style={styles.subTitle}>Base Stats</Title>
        {pokemon.stats.map((s, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statName}>
              {s.stat.name.replace('-', ' ')}
            </Text>
            <Text style={styles.statValue}>{s.base_stat}</Text>
            <ProgressBar
              progress={s.base_stat / 255} // 255 é o stat máximo (Blissey HP)
              color={s.base_stat > 50 ? MD3Colors.primary40 : MD3Colors.error40}
              style={styles.progressBar}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  image: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
    marginTop: 10,
  },
  id: {
    fontSize: 16,
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  chip: {
    marginHorizontal: 5,
  },
  chipText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  measurementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  measurement: {
    alignItems: 'center',
  },
  measurementText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  measurementLabel: {
    fontSize: 14,
    color: '#666',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statName: {
    width: 110,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  statValue: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
});

export default DetailsScreen;