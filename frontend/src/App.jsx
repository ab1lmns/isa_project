import './App.css'
import {Route,Routes,Navigate} from "react-router-dom"
import Navbar from './components/Navbar/Navbar'
import Main from './components/Main/Main'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import NewDetail from './components/NewDetail/NewDetail'
import Dashboard from './pages/Dashboard/Dashboard'
import Admin from './pages/Admin/Admin'

function App() {
  return (
    <>
    <Routes>
        <Route path="/" element={<Main/> } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route path="/news/:id" element={<NewDetail />} />
         <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App
