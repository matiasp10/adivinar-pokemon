export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

export interface FormularioProps {
  verifyPokemon: (event: React.FormEvent<HTMLFormElement>) => void;
  newPokemon: string;
  handleNewPokemon: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isWrong: boolean;
  isGuessed: boolean;
}

export interface PokemonImageProps {
  image: string;
  alt: string;
  isGuessed: boolean;
}

export interface PokemonNameProps {
  name: string;
  isGuessed: boolean;
}

export interface ErrorMessageProps {
  isWrong: boolean;
}

export interface NextPokemonButtonProps {
  onClick: () => void;
}