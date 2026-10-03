import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white">

            {/* Logo */}
            <div className="border-b border-gray-800 px-6 py-5">
                <h1 className="text-2xl font-bold">
                    HRM
                </h1>

                <p className="mt-1 text-xs text-gray-400">
                    Employee Management
                </p>
            </div>


            {/* Menu */}
            <nav className="p-4">

                <Link
                    to="/"
                    className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
                >
                    <span>📊</span>
                    Dashboard
                </Link>


                <Link
                    to="/employees"
                    className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
                >
                    <span>👥</span>
                    Employees
                </Link>


                <Link
                    to="/departments"
                    className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
                >
                    <span>🏢</span>
                    Departments
                </Link>


                <Link
                    to="/attendance"
                    className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
                >
                    <span>🕐</span>
                    Attendance
                </Link>


                <Link
                    to="/leave"
                    className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
                >
                    <span>📅</span>
                    Leave
                </Link>


                <Link
                    to="/payroll"
                    className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
                >
                    <span>💰</span>
                    Payroll
                </Link>


                <Link
                    to="/settings"
                    className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
                >
                    <span>⚙️</span>
                    Settings
                </Link>

            </nav>


            {/* Logout */}
            <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">

                <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-gray-800">
                    <span>🚪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
