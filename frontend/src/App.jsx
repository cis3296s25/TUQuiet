import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import Buildings from "./pages/Buildings";
import Home from "./pages/Home";
import StudySpotsInBuilding from "./pages/StudySpotsInBuilding";
import RecommendationsPage from "./pages/RecommendationsPage";
import ReportingForm from "./components/ReportingForm";
import StudyGroup from "./pages/StudyGroups";
import { Toaster } from "sonner";
import './index.css'; // Adjust path if different
import websocketService from "./utils/websocketService";



function App() {
  // initialize websocket connection when app starts
  useEffect(() => {
    // connect to websocket
    websocketService.connect(
      () => console.log('websocket connected successfully'),
      (error) => console.error('웹소켓 연결 실패:', error)
    );

    // disconnect from websocket when component unmounts
    return () => {
      websocketService.disconnect();
    };
  }, []);

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="Building" element={<Buildings />} />
          <Route
            path="Building/:BuildingId"
            element={<StudySpotsInBuilding />}
          />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="studyGroups" element={<StudyGroup />} />
          
        </Route>
      </Routes>
    </Router>

    <Toaster />
    </>
  );
}

export default App;
