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

export interface Sprites {
  front_default: string;
  back_default: string;
  other: {
    "official-artwork": {
      front_default: string;
    };
  };
}

export interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Form {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  imageBack: string;
  types: Type[];
}
