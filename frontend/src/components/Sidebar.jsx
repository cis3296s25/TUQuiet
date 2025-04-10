import { NavLink, Link } from "react-router-dom";
import shhEmoji from "../assets/shhEmoji.webp";

function Sidebar() {
  return (
    <div className="bg-[#171717] light:bg-[#f9f9f9]" data-testid="sidebar">
      <div className="flex items-center justify-center pl-2 mt-3">
        <span className="text-white font-sans font-bold text-3xl">
          <Link to="/" data-testid="home-link">
            <span className="text-red-500">TU</span><span className="light:text-black">Quiet</span>
          </Link>
          <img src={shhEmoji} className="inline align-middle h-8 ml-2" />
        </span>
      </div>
      <nav className="w-64 flex flex-col justify-between mt-5">
        <ul className="p-0 flex flex-col space-y-2 w-full">
          <li className="w-full">
            <NavLink
              to="/Building"
              className={({ isActive }) =>
                isActive
                  ? "py-2 px-4 text-white font-semibold rounded-lg transition-all duration-200 bg-red-400 w-full block light:text-black"
                  : "py-2 px-4 text-white hover:bg-[#2f2f2f] rounded transition-colors duration-200 w-full block light:text-black light:hover:bg-[#e3e3e3]"
              }
            >
              Buildings
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                isActive
                  ? "py-2 px-4 text-white font-semibold rounded-lg transition-all duration-200 bg-red-400 w-full block light:text-black"
                  : "py-2 px-4 text-white hover:bg-[#2f2f2f] rounded transition-colors duration-200 w-full block light:text-black light:hover:bg-[#e3e3e3]"
              }
            >
              Recommendations
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
