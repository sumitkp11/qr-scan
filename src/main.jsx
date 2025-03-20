import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import ScanCode from './components/ScanCode.jsx';
import GenerateCode from './components/GenerateCode.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<App />} />
      <Route exact path='/scan' element={<ScanCode />} />
      <Route exact path='/generate' element={<GenerateCode />} />
    </Routes>
  </BrowserRouter>
)
