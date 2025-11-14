export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: { // Adicionando 'other' para imagens de melhor qualidade
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  description?: string;
  // Adicione outros campos que queira exibir nos detalhes
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}