import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import NoiseReporting from './pages/NoiseReporting';
import NavigateCampus from './pages/NavigateCampus';
import BusyHours from './pages/BusyHours';
import StudyAreas from './pages/StudyAreas';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout/>} >
        <Route path="/" element={<Home />} /> 
          <Route path="NoiseReporting" element={<NoiseReporting />} /> 
          <Route path="NavigateCampus" element={<NavigateCampus />} /> 
          <Route path="StudyAreas" element={<StudyAreas />} /> 
          <Route path="BusyHours" element={<BusyHours />} /> 
        </ Route>
      </Routes>
    </Router>
  )
}

export default App
