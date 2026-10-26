import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await api.get('/employees', {
                params: {
                    search: search,
                    page: currentPage,
                }
            });

            // The backend returns a LengthAwarePaginator inside response.data.data
            const paginator = response.data.data;
            setEmployees(paginator.data || []);
            setCurrentPage(paginator.current_page || 1);
            setLastPage(paginator.last_page || 1);
            setTotal(paginator.total || 0);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // reset to page 1 on search
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, currentPage]);
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this employee?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/employees/${id}`);

            setEmployees((prevEmployees) =>
                prevEmployees.filter((employee) => employee.id !== id)
            );
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                'Failed to delete employee.'
            );
        }
    };



    return (
        <div className="p-8">

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Employees
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your employees
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                    <Link
                        to="/employees/create"
                        className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Add Employee
                    </Link>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {loading ? (
                    <div className="p-6 text-center text-gray-500">
                        Loading employees...
                    </div>
                ) : employees.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No employees found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">

                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Name
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Designation
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Department
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Salary
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">

                                {employees.map((employee) => (
                                    <tr key={employee.id}>

                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {employee.name}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {employee.email}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {employee.designation}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {employee.department}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {employee.salary ?? '-'}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${employee.status === 'Active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {employee.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium">
                                            <Link
                                                to={`/employees/${employee.id}/edit`}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
                                                className="ml-4 text-sm font-medium text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                to={`/employees/${employee.id}/profile`}
                                                className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                                            >
                                                View Profile
                                            </Link>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && employees.length > 0 && lastPage > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{employees.length}</span> of{' '}
                            <span className="font-semibold">{total}</span> results
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                disabled={currentPage === 1}
                                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                disabled={currentPage === lastPage}
                                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Employees;
