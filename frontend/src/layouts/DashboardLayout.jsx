import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto bg-[#212121] light:bg-[#ffffff]">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
