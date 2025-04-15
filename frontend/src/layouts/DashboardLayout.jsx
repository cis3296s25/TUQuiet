import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1  overflow-auto bg-white dark:bg-[#212121]">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
