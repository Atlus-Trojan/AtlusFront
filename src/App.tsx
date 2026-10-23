import { Navigate, Route, Routes } from 'react-router-dom'
import { DiretoriasPage } from './pages/DiretoriasPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/diretorias" replace />} />
      <Route path="/diretorias" element={<DiretoriasPage />} />
    </Routes>
  )
}

export default App
