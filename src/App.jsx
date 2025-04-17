import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InputFeedbackScreen from './components/InputFeedbackScreen'

function App() {
  const [count, setCount] = useState(0)

  return (
    <InputFeedbackScreen/>
  )
}

export default App
