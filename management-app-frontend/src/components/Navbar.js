import { FaSearch, FaSignOutAlt } from "react-icons/fa";
import { HiOutlineClipboardList, HiOutlineCalendar, HiOutlineArchive, HiOutlineCash } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col fixed left-0 top-0">
      {/* Profile */}
      <div className="flex items-center px-6 py-6 border-b">
        <div className="bg-pink-400 text-white rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold">
          A
        </div>
        <div className="ml-4">
          <p className="font-semibold">Armand</p>
          <p className="text-sm text-gray-500">armand@eventify.com</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none ml-2 w-full"
          />
        </div>
      </div>

      <nav className="mt-6 flex-1">
        <ul className="space-y-1 px-4">
          <NavItem icon={<MdDashboard />} label="Dashboard" active />
          <NavItem icon={<HiOutlineCalendar />} label="Events" />
          <NavItem icon={<HiOutlineClipboardList />} label="Tasks" />
          <NavItem icon={<HiOutlineCash />} label="Budget" />
          <NavItem icon={<HiOutlineArchive />} label="Archive" />
        </ul>
      </nav>

      <div className="px-6 py-4 border-t mt-auto">
        <button className="flex items-center text-gray-600 hover:text-red-500">
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
  <li>
    <a
      href="#"
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        active
          ? "bg-pink-100 text-pink-600"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      {label}
    </a>
  </li>
);

export default Sidebar;
