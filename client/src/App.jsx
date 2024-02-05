
import './App.css'
import Editor from './components/Editor'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Home from './components/Home'

function App() {
  // const navigate = useNavigate();
  return (
      <BrowserRouter>
        <Routes>

          <Route 
            path="/" 
            element={<Home />} 
          />


          <Route 
            path="/documents/:id" 
            element={<Editor />}
          /> 
        </Routes>
      </BrowserRouter>
  )
}

export default App
