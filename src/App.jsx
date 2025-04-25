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
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <div className="grid grid-cols-2">
        <div><h1>Vite + React</h1></div><div className='flex items-center justify-center scale-125'><Animation1/></div>
        </div>
        
        <div>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Test <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
          <div class="scroll-down"></div>
        </p>
      </div>
      


      <div>
        <Posts />
      </div>

    </>
  )
}

export default App
