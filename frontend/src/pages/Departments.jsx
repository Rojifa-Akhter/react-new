
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await api.get('/departments', {
                params: {
                    search,
                    page: currentPage,
                    per_page: 10,
                },
            });

            const paginator = response.data.data;

            setDepartments(paginator.data ?? []);
            setCurrentPage(paginator.current_page ?? 1);
            setLastPage(paginator.last_page ?? 1);
            setTotal(paginator.total ?? 0);
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.message ||
                'Failed to load departments.'
            );
        } finally {
            setLoading(false);
        }
    }, [search, currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDepartments();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchDepartments]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this department?'
        );

        if (!confirmed) return;

        try {
            await api.delete(`/departments/${id}`);

            if (departments.length === 1 && currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
            } else {
                await fetchDepartments();
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Failed to delete department.'
            );
        }
    };

    return (
        <div className="p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Departments
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your organization departments.
                    </p>
                </div>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search departments..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 sm:w-64"
                    />

                    <Link
                        to="/departments/create"
                        className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Add Department
                    </Link>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">
                        Loading departments...
                    </div>
                ) : errorMessage ? (
                    <div className="p-6 text-center text-red-600">
                        {errorMessage}
                        <button
                            onClick={fetchDepartments}
                            className="ml-3 font-medium underline"
                        >
                            Retry
                        </button>
                    </div>
                ) : departments.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No departments found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {departments.map((department, index) => (
                                    <tr key={department.id}>
                                        <td className="px-6 py-4">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {department.name}
                                        </td>

                                        <td className="px-6 py-4">
                                            {department.code}
                                        </td>

                                        <td className="max-w-xs truncate px-6 py-4 text-gray-500">
                                            {department.description || '—'}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    department.status === 'Active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {department.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <Link
                                                    to={`/departments/${department.id}/edit`}
                                                    className="font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(department.id)}
                                                    className="font-medium text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !errorMessage && departments.length > 0 && (
                    <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * 10 + 1}–
                            {(currentPage - 1) * 10 + departments.length} of {total} departments
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                disabled={currentPage === 1}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="px-2 py-2 text-sm text-gray-600">
                                Page {currentPage} of {lastPage}
                            </span>

                            <button
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                disabled={currentPage === lastPage}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
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

export default Departments;
