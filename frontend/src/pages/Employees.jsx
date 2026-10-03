import { Link } from 'react-router-dom';
function Employees() {

    const employees = [
        {
            id: 1,
            name: 'Rojifa Akhter',
            email: 'rojifa@gmail.com',
            designation: 'Laravel Developer',
            department: 'Development',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Rahim Ahmed',
            email: 'rahim@gmail.com',
            designation: 'PHP Developer',
            department: 'Development',
            status: 'Active',
        },
        {
            id: 3,
            name: 'Karim Hasan',
            email: 'karim@gmail.com',
            designation: 'UI Designer',
            department: 'Design',
            status: 'Inactive',
        },
    ];

    return (
        <div className="p-8">

            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Employees
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage all employees
                    </p>
                </div>

                <Link
                    to="/employees/create"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add Employee
                </Link>

            </div>


            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 p-5">

                    <input
                        type="text"
                        placeholder="Search employee..."
                        className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
                    />

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-50">

                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                                    Name
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

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                                    Action
                                </th>
                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {employees.map((employee) => (

                                <tr key={employee.id} className="hover:bg-gray-50">

                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {employee.name}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {employee.email}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {employee.designation}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {employee.department}
                                    </td>

                                    <td className="px-6 py-4">

                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                            {employee.status}
                                        </span>

                                    </td>

                                    <td className="px-6 py-4">

                                        <button className="mr-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                                            Edit
                                        </button>

                                        <button className="text-sm font-medium text-red-600 hover:text-red-800">
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Employees;
