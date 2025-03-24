import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import NoiseReporting from "./pages/NoiseReporting";
import NavigateCampus from "./pages/NavigateCampus";
import Buildings from "./pages/Buildings";
import StudyAreas from "./pages/StudyAreas";
import Home from "./pages/Home";
import StudySpotsInBuilding from "./pages/StudySpotsInBuilding";
import ReportingForm from "./components/ReportingForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="NoiseReporting" element={<NoiseReporting />} />
          <Route path="NavigateCampus" element={<NavigateCampus />} />
          <Route path="StudyAreas" element={<StudyAreas />} />
          <Route path="Building" element={<Buildings />} />
          <Route
            path="Building/:BuildingId"
            element={<StudySpotsInBuilding />}
          />
          {/* <Route path="Building/:BuildingId/Spot/:SpotId" element={<ReportingForm />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
