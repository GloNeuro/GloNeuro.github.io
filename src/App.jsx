import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Posts from './assets/components/Posts'
import '@lottiefiles/lottie-player';
import Animation1 from './assets/components/Animation1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <div className="grid grid-cols-2">
          <div><h1>GloNeuro</h1></div><div className='flex items-center justify-center scale-125'><Animation1 /></div>
        </div>
      </div>

      <div class="scroll-down"></div>

      <div>
        <Posts />
      </div>

    </>
  )
}

export default App
