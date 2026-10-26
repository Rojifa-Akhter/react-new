
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../api";

function Sidebar() {
    const navigate = useNavigate();

    const menuItems = [
        { path: "/", icon: "📊", label: "Dashboard", end: true },
        { path: "/employees", icon: "👥", label: "Employees" },
        { path: "/departments", icon: "🏢", label: "Departments" },
        { path: "/designations", icon: "🏷️", label: "Designations" },
        { path: "/attendance", icon: "🕐", label: "Attendance" },
        { path: "/leave-requests", icon: "📅", label: "Leave" },
        { path: "/payroll", icon: "💰", label: "Payroll" },
        { path: "/settings", icon: "⚙️", label: "Settings" },
    ];

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
        }
    };

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-gray-900 text-white">
            {/* Logo */}
            <div className="border-b border-gray-800 px-6 py-5">
                <h1 className="text-2xl font-bold">HRM</h1>
                <p className="mt-1 text-xs text-gray-400">
                    Employee Management
                </p>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto p-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                                isActive
                                    ? "bg-indigo-600 font-semibold text-white"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="border-t border-gray-800 p-4">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                >
                    <span>🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;

