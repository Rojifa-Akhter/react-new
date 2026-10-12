import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Designations() {
    const [designations, setDesignations] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchDesignations = useCallback(async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await api.get('/designations', {
                params: {
                    search,
                    page: currentPage,
                    per_page: 10,
                },
            });

            const paginator = response.data.data;

            setDesignations(paginator.data ?? []);
            setCurrentPage(paginator.current_page ?? 1);
            setLastPage(paginator.last_page ?? 1);
            setTotal(paginator.total ?? 0);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ??
                'Failed to load designations.'
            );
        } finally {
            setLoading(false);
        }
    }, [search, currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDesignations();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchDesignations]);

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleDelete = async (id, name) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${name}"?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/designations/${id}`);

            // Current page-e last record delete hole previous page-e jabe.
            if (designations.length === 1 && currentPage > 1) {
                setCurrentPage((page) => page - 1);
            } else {
                await fetchDesignations();
            }
        } catch (error) {
            window.alert(
                error.response?.data?.message ??
                'Failed to delete designation.'
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Designation Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your company designations.
                    </p>
                </div>

                <Link
                    to="/designations/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add Designation
                </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-semibold text-gray-800">
                            All Designations
                        </h2>
                        <p className="text-sm text-gray-500">
                            Total: {total}
                        </p>
                    </div>

                    <input
                        type="search"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search name or code..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-xs"
                    />
                </div>

                {errorMessage && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-10 text-center text-gray-500"
                                    >
                                        Loading designations...
                                    </td>
                                </tr>
                            ) : designations.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-10 text-center text-gray-500"
                                    >
                                        No designations found.
                                    </td>
                                </tr>
                            ) : (
                                designations.map((designation, index) => (
                                    <tr
                                        key={designation.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-gray-500">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>

                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {designation.name}
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {designation.code}
                                        </td>

                                        <td className="max-w-xs truncate px-4 py-3 text-gray-600">
                                            {designation.description || '—'}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    designation.status === 'Active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {designation.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/designations/${designation.id}/edit`}
                                                    className="rounded-md border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            designation.id,
                                                            designation.name
                                                        )
                                                    }
                                                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-5 flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                    <p className="text-sm text-gray-500">
                        Page {currentPage} of {lastPage}
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) => Math.max(1, page - 1))
                            }
                            disabled={currentPage <= 1 || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(lastPage, page + 1)
                                )
                            }
                            disabled={currentPage >= lastPage || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
