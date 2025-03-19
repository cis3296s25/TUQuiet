import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardLayout from './layouts/DashboardLayout';


function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<DashboardLayout/>} />
      </Routes>
    </Router>
  )
}

export default App
