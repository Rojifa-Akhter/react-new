import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import AttendancePunchCard from '../components/AttendancePunchCard';
import { useEffect, useState } from 'react';
import api from '../api';

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_employees: 0,
        departments: 0,
        present_today: 0,
        on_leave: 0,
    });
    const [recentEmployees, setRecentEmployees] = useState([]);


    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data.data);
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            }
        };

        const fetchRecentEmployees = async () => {
            try {
                const response = await api.get('/employees?per_page=5');
                const result = response.data.data;

                setRecentEmployees(result.data ?? result);
            } catch (error) {
                console.error('Failed to load recent employees:', error);
            }
        };

        fetchDashboardStats();
        fetchRecentEmployees();
    }, []);

    return (
        <div className="p-8">

            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                    Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Here's what's happening with your organization.
                </p>
            </div>


            {/* Statistics */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Employees"
                    value={stats.total_employees}
                    icon="👥"
                />

                <StatCard
                    title="Departments"
                    value={stats.departments}
                    icon="🏢"
                />

                <StatCard
                    title="Present Today"
                    value={stats.present_today}
                    icon="🟢"
                />

                <StatCard
                    title="On Leave"
                    value={stats.on_leave}
                    icon="🔴"
                />
            </div>
            {/* Attendance Check-in / Check-out */}
            <div className="mt-8">
                <AttendancePunchCard />
            </div>


            {/* Recent Employees */}
            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Recent Employees
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Recently added employees
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/employees')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Add Employee
                    </button>

                </div>


                {/* Table */}
                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-50">

                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                                    Employee
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                                    Designation
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                                    Department
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                                    Status
                                </th>
                            </tr>

                        </thead>



                        <tbody className="divide-y divide-gray-100">
                            {recentEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                                {employee.name?.charAt(0).toUpperCase()}
                                            </div>

                                            <span className="text-sm font-medium text-gray-900">
                                                {employee.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {employee.email}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {employee.designation || '—'}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {employee.department || '—'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                            {employee.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {recentEmployees.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>


                    </table>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
