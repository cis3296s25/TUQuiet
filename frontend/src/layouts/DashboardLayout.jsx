import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function DashboardLayout() {
  return (
    <div className="flex h-screen border-2 border-amber-600">
      <Sidebar />
      <div className="flex-1 p-4 border-2 border-blue-600">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;