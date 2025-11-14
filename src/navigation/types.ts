import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pokemon } from '../types/pokemon';

export type RootStackParamList = {
  Home: undefined; // Tela Home não recebe parâmetros
  Details: { pokemon: Pokemon }; // Tela Details recebe um objeto Pokemon
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;