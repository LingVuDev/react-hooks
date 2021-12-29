// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import React, { useState } from 'react'

function Greeting({ initialName = '' }) {
  // 💣 delete this variable declaration and replace it with a React.useState call
  // const name = '';
  const [name, setName] = useState(initialName);

  function handleChange(event) {
    // 🐨 update the name here based on event.target.value
    setName(event.target.value);
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName={'Georg'} />
}

export default App
