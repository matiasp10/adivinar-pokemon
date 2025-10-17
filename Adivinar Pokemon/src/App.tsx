import './App.css'
import "nes.css/css/nes.min.css";
import api from './api';
import { useEffect, useState } from 'react';
import type { ErrorMessageProps, FormularioProps, NextPokemonButtonProps, Pokemon, PokemonImageProps, PokemonNameProps, Stats, StatsDisplayProps } from './types';


function App() {

  const getInitialStats = (): Stats => {
    const savedStats = localStorage.getItem('pokemonStats');
    if (savedStats) {
      return JSON.parse(savedStats);
    }
    return { aciertos: 0, errores: 0 };
  };

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [newPokemon, setNewPokemon] = useState<string>("");
  const [isGuessed, setIsGuessed] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>(getInitialStats);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);

  const getPokemon = async (): Promise<void> => {
    const data = await api.random()
    console.log(data)
    setPokemon(data);
    setIsGuessed(false);
    setIsWrong(false);
    setNewPokemon("");
    setHasAttempted(false);
  }


  useEffect(() => {
    getPokemon();
  }, []);

  useEffect(() => {
    localStorage.setItem('pokemonStats', JSON.stringify(stats));
  }, [stats]);

  if (!pokemon) return <div>Cargando...</div>;

  const handleNewPokemon = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    setNewPokemon(event.target.value);
  }

  const verifyPokemon = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (hasAttempted) return;


    setIsWrong(false);

    if (normalizePokemonName(newPokemon) === normalizePokemonName(pokemon.name)) {
      setIsGuessed(true);
      setHasAttempted(true);
      setStats(prev => ({ ...prev, aciertos: prev.aciertos + 1 }));
    } else {
      setIsWrong(true);
      setStats(prev => ({ ...prev, errores: prev.errores + 1 }));
    }
  }

  const normalizePokemonName = (name: string): string => {
    return name.toLowerCase().replace(/[\s.-]/g, "");
  }

  const resetStats = (): void => {
    setStats({ aciertos: 0, errores: 0 });
  }

  return (
    <>
      <main className="App">
        <div className="nes-container is-centered main">
          <h1>¿Quien es este pokemon?</h1>

          <StatsDisplay stats={stats} onReset={resetStats} />

          <PokemonName name={pokemon.name} isGuessed={isGuessed} />

          <PokemonImage image={pokemon.image} alt={isGuessed ? pokemon.name : "Secreto"} isGuessed={isGuessed} />

          <Formulario verifyPokemon={verifyPokemon} newPokemon={newPokemon} handleNewPokemon={handleNewPokemon} isWrong={isWrong} isGuessed={isGuessed} hasAttempted={hasAttempted} />

          <ErrorMessage isWrong={isWrong} />

          <NextPokemonButton onClick={getPokemon} />
        </div>
      </main>
    </>
  )
}

const Formulario = ({ verifyPokemon, newPokemon, handleNewPokemon, isWrong, isGuessed, hasAttempted }: FormularioProps) => {
  return (
    <form onSubmit={verifyPokemon} className='form'>
      <input value={newPokemon} onChange={handleNewPokemon} type="text" id="name_field" className={`nes-input ${isWrong ? "is-error" : ""} ${isGuessed ? "is-success" : ""}`} disabled={hasAttempted} />
      <button type="submit" className="btn nes-btn is-primary" disabled={hasAttempted}>Adivina</button>
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

const StatsDisplay = ({ stats, onReset }: StatsDisplayProps) => {
  return (
    <div className="stats-container" style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
      <div className="nes-badge">
        <span className="is-success">✓ {stats.aciertos}</span>
      </div>
      <div className="nes-badge">
        <span className="is-error">✗ {stats.errores}</span>
      </div>
      <button onClick={onReset} className="nes-btn is-warning" style={{ padding: '8px 12px', fontSize: '12px' }}>
        Reset
      </button>
    </div>
  );
};

export default App
