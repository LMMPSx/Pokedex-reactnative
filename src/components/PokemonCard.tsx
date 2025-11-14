import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { Pokemon } from '../types/pokemon';
import { typeColors } from '../constants/colors';

type Props = {
  pokemon: Pokemon;
  onPress: () => void;
};

const PokemonCard = ({ pokemon, onPress }: Props) => {
  // Pega a cor do primeiro tipo para o card
  const mainType = pokemon.types[0].type.name;
  const cardColor = typeColors[mainType] || '#777';

  // Capitaliza o nome
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  // Usa a arte oficial se disponível, senão o sprite
  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;

  return (
    <Card style={[styles.card, { borderColor: cardColor }]} onPress={onPress}>
      <Card.Content style={styles.content}>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        <Text style={styles.name}>{name}</Text>
        
        {/* Imagem do Pokémon */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        )}
        
        {/* Tipos do Pokémon */}
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
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderWidth: 2,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
    padding: 10,
  },
  id: {
    fontSize: 12,
    color: '#555',
    position: 'absolute',
    top: 5,
    right: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  typesContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  chip: {
    marginHorizontal: 2,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default PokemonCard;