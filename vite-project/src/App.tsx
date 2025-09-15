import { useState } from 'react'
import './App.css'
import Search from './components/Search'
import Player from './components/Player'
import Recent from './components/Recent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Search />
      <Player />
      <Recent />
    </>
  )
}

export default App
