import { useState } from 'react'
import './App.css'
import './index.css'

const boardArray = Array(9).fill(null)


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='board'>
        {boardArray.map((value, index) => 
          <button key={index}>{value}</button>
        )}
      </div>
      <p className="read-the-docs">
        This is my Tic Tac Toe Board!
      </p>
    </>
  )
}

export default App
