import StatCard from '../components/StatCard';

function Dashboard() {
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
                    value="25"
                    icon="👥"
                />

                <StatCard
                    title="Departments"
                    value="6"
                    icon="🏢"
                />

                <StatCard
                    title="Present Today"
                    value="21"
                    icon="🟢"
                />

                <StatCard
                    title="On Leave"
                    value="4"
                    icon="🔴"
                />

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

                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
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

                            <tr className="hover:bg-gray-50">

                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                            RA
                                        </div>

                                        <span className="text-sm font-medium text-gray-900">
                                            Rojifa Akhter
                                        </span>

                                    </div>

                                </td>

                                <td className="px-6 py-4 text-sm text-gray-500">
                                    rojifa@gmail.com
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    Laravel Developer
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    Development
                                </td>

                                <td className="px-6 py-4">

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                        Active
                                    </span>

                                </td>

                            </tr>


                            <tr className="hover:bg-gray-50">

                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600">
                                            RA
                                        </div>

                                        <span className="text-sm font-medium text-gray-900">
                                            Rahim Ahmed
                                        </span>

                                    </div>

                                </td>

                                <td className="px-6 py-4 text-sm text-gray-500">
                                    rahim@gmail.com
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    PHP Developer
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    Development
                                </td>

                                <td className="px-6 py-4">

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                        Active
                                    </span>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
