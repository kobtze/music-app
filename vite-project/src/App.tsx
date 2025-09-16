import { useState } from 'react'
import './App.css'
import Search from './features/search/Search'
import Player from './features/player/Player'
import Recent from './features/search/Recent'
import { useImageAnimation } from './hooks/useImageAnimation'
import type { SelectedImage } from './types'

function App() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null)
  const { animateImageSelection } = useImageAnimation()

  const handleImageSelect = (image: SelectedImage, sourceElement: HTMLElement) => {
    animateImageSelection(image, sourceElement, setSelectedImage)
  }

  return (
    <>
      <div className="components-row">
        <Search onImageSelect={handleImageSelect} />
        <Player selectedImage={selectedImage} />
        <Recent />
      </div>
    </>
  )
}

export default App
