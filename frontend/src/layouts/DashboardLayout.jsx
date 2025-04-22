import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {useState, useEffect} from "react"; 
import { Menu } from "lucide-react";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const location = useLocation(); //get current location so we can auto close on navigation

  useEffect(() => {
    setSidebarOpen(false);

  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`
          fixed z-999 top-0 left-0 h-full bg-white dark:bg-[#171717]
          transition-transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:static sm:block w-64
        `}
      >

      <Sidebar />
      </div>
      <div
        className="flex-1 overflow-auto bg-white dark:bg-[#212121]"
        data-testid="dashboard-outlet"
      >
        <div className="sm:hidden flex items-center justify-between p-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6 text-black dark:text-white" />
          </button>
          <span className="text-lg font-semibold">TUQuiet</span>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
