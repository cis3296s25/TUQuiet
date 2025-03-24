import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Buildings from "./pages/Buildings";
import Home from "./pages/Home";
import StudySpotsInBuilding from "./pages/StudySpotsInBuilding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="Building" element={<Buildings />} />
          <Route
            path="Building/:BuildingId"
            element={<StudySpotsInBuilding />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
