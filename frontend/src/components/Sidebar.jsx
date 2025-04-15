import { NavLink, Link } from "react-router-dom";
import shhEmoji from "../assets/shhEmoji.webp";
import shushingOwl from "../assets/shushingOwl.png"

function Sidebar() {
  return (
    <div className="dark:bg-[#171717] bg-[#f9f9f9]" data-testid="sidebar">
      <div className="flex items-center justify-center pl-2 mt-3">
        <span className="text-white font-sans font-bold text-3xl">
          <Link to="/" data-testid="home-link">
            <span className="text-[#cc103f]">TU</span><span className="text-black dark:text-white">Quiet</span>
          </Link>
          <img src={shushingOwl} className="inline align-middle h-12 ml-3 mb-1" />
        </span>
      </div>
      <nav className="w-64 flex flex-col justify-between mt-5">
        <ul className="p-0 flex flex-col space-y-2 w-full">
          <li className="w-full">
            <NavLink
              to="/Building"
              className={({ isActive }) =>
                isActive
                  ? "py-2 px-4 text-black font-semibold rounded-lg transition-all duration-200 bg-[#7a0926] w-full block dark:text-white"
                  : "py-2 px-4 text-black dark:hover:bg-[#2f2f2f] rounded transition-colors duration-200 w-full block dark:text-white hover:bg-[#e3e3e3]"
              }
            >
              Make a Report 
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                isActive
                  ? "py-2 px-4 text-black font-semibold rounded-lg transition-all duration-200 bg-[#7a0926] w-full block dark:text-white"
                  : "py-2 px-4 text-black dark:hover:bg-[#2f2f2f] rounded transition-colors duration-200 w-full block dark:text-white hover:bg-[#e3e3e3]"
              }
            >
              Recommendations
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink
              to="/studyGroups"
              className={({ isActive }) =>
                isActive
                  ? "py-2 px-4 text-black font-semibold rounded-lg transition-all duration-200 bg-[#7a0926] w-full block dark:text-white"
                  : "py-2 px-4 text-black dark:hover:bg-[#2f2f2f] rounded transition-colors duration-200 w-full block dark:text-white hover:bg-[#e3e3e3]"
              }
            >
              Find a Study Group
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
