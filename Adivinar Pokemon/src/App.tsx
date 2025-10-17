import './App.css'
import "nes.css/css/nes.min.css";
import api from './api';
import { useEffect, useState } from 'react';
import type { ErrorMessageProps, FormularioProps, NextPokemonButtonProps, Pokemon, PokemonImageProps, PokemonNameProps } from './types';


function App() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [newPokemon, setNewPokemon] = useState<string>("");
  const [isGuessed, setIsGuessed] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);

  const getPokemon = async (): Promise<void> => {
    const data = await api.random()
    console.log(data)
    setPokemon(data);
    setIsGuessed(false);
    setIsWrong(false);
    setNewPokemon("");
  }

  useEffect(() => {
    getPokemon();
  }, []);

  if (!pokemon) return <div>Cargando...</div>;

  const handleNewPokemon = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    setNewPokemon(event.target.value);
  }

  const verifyPokemon = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsWrong(false);
    if (newPokemon.toLowerCase() === pokemon.name.toLowerCase()) {
      setIsGuessed(true);
    } else {
      setIsWrong(true);
    }
  }

  return (
    <>
      <main className="App">
        <div className="nes-container is-centered main">
          <h1>¿Quien es este pokemon?</h1>

          <PokemonName name={pokemon.name} isGuessed={isGuessed} />

          <PokemonImage image={pokemon.image} alt={isGuessed ? pokemon.name : "Secreto"} isGuessed={isGuessed} />

          <Formulario verifyPokemon={verifyPokemon} newPokemon={newPokemon} handleNewPokemon={handleNewPokemon} isWrong={isWrong} isGuessed={isGuessed} />

          <ErrorMessage isWrong={isWrong} />

          <NextPokemonButton onClick={getPokemon} />
        </div>
      </main>
    </>
  )
}

const Formulario = ({ verifyPokemon, newPokemon, handleNewPokemon, isWrong, isGuessed }: FormularioProps) => {
  return (
    <form onSubmit={verifyPokemon} className='form'>
      <input value={newPokemon} onChange={handleNewPokemon} type="text" id="name_field" className={`nes-input ${isWrong ? "is-error" : ""} ${isGuessed ? "is-success" : ""}`} />
      <button type="submit" className="btn nes-btn is-primary">Adivina</button>
    </form>
  )
}

const PokemonImage = ({ image, alt, isGuessed }: PokemonImageProps) => {
  return (
    <img
      src={image}
      alt={alt}
      className={`${isGuessed ? "" : "guess"}`}
    />
  );
};

export const PokemonName = ({ name, isGuessed }: PokemonNameProps) => {
  if (!isGuessed) return null;

  return <h1 className='nes-text is-success'>{name}</h1>;
};

export const ErrorMessage = ({ isWrong }: ErrorMessageProps) => {
  if (!isWrong) return null;

  return <h2 className='nes-text is-error'>Intenta de nuevo</h2>;
};

export const NextPokemonButton = ({ onClick }: NextPokemonButtonProps) => {
  return (
    <button onClick={onClick} className='nes-btn'>
      Otro Pokemon
    </button>
  );
};

export default App
