import { useState } from 'react'
import './App.css'
import Search from './components/Search'
import Player from './components/Player'
import Recent from './components/Recent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="components-row">
        <Search />
        <Player />
        <Recent />
      </div>
    </>
  )
}

export default App
