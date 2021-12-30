// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [{ status, pokemon }, setState] = React.useState({ status: 'idle', pokemon: null });
  const [error, setError] = React.useState();
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  React.useEffect(() => {
    if (pokemonName) {
      setState((currentState) => ({ ...currentState, status: 'pending' }));
      fetchPokemon(pokemonName)
        .then((value) => {
          setState(() => ({ pokemon: value, status: 'resolved' }));
        })
        .catch((error) => {
          setError(error) 
          setState((currentState) => ({ ...currentState, status: 'rejected' }));
        });
    } else {
      setState((currentState) => ({ ...currentState, status: 'idle' }));
    }
  }, [pokemonName]);

  if (status === 'rejected') throw error;

  return (
    <>
      { 
        status === 'idle'
          ? 'Submit a pokemon'
          : status === 'resolved'
          ? <PokemonDataView pokemon={pokemon} />
          : <PokemonInfoFallback name={pokemonName} />
      }
    </>
  );
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
