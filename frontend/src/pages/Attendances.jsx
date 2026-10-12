import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Attendances() {
    const [attendances, setAttendances] = useState([]);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchAttendances = useCallback(async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await api.get('/attendance', {
                params: {
                    search,
                    date: date || undefined,
                    page: currentPage,
                    per_page: 10,
                },
            });

            const paginator = response.data.data;

            setAttendances(paginator.data ?? []);
            setCurrentPage(paginator.current_page ?? 1);
            setLastPage(paginator.last_page ?? 1);
            setTotal(paginator.total ?? 0);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ??
                'Failed to load attendance records.'
            );
        } finally {
            setLoading(false);
        }
    }, [search, date, currentPage]);

    useEffect(() => {
        const timer = setTimeout(fetchAttendances, 300);
        return () => clearTimeout(timer);
    }, [fetchAttendances]);

    const handleDelete = async (attendance) => {
        if (!window.confirm('Delete this attendance record?')) return;

        try {
            await api.delete(`/attendance/${attendance.id}`);

            if (attendances.length === 1 && currentPage > 1) {
                setCurrentPage((page) => page - 1);
            } else {
                await fetchAttendances();
            }
        } catch (error) {
            window.alert(
                error.response?.data?.message ??
                'Failed to delete attendance.'
            );
        }
    };

    const statusClass = (status) => {
        const styles = {
            Present: 'bg-green-100 text-green-700',
            Late: 'bg-amber-100 text-amber-700',
            Absent: 'bg-red-100 text-red-700',
            'Half Day': 'bg-blue-100 text-blue-700',
            Leave: 'bg-gray-100 text-gray-700',
        };

        return styles[status] ?? 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Attendance Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage daily check-in and check-out records.
                    </p>
                </div>

                <Link
                    to="/attendance/create"
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add Attendance
                </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search employee name or email..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setDate('');
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Clear
                    </button>
                </div>

                <div className="mb-4 text-sm text-gray-500">
                    Total records: {total}
                </div>

                {errorMessage && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Employee</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Check-in</th>
                                <th className="px-4 py-3">Check-out</th>
                                <th className="px-4 py-3">Late Minutes</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                                        Loading attendance...
                                    </td>
                                </tr>
                            ) : attendances.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                attendances.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-800">
                                                {item.employee?.name ?? 'Unknown'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.employee?.email ?? ''}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {String(item.attendance_date).slice(0, 10)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.check_in?.slice(0, 5) ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.check_out?.slice(0, 5) ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.late_minutes ?? 0} min
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/attendance/${item.id}/edit`}
                                                    className="rounded-md border border-blue-200 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item)}
                                                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
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

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500">
                        Page {currentPage} of {lastPage}
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            disabled={currentPage <= 1 || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.min(lastPage, page + 1))}
                            disabled={currentPage >= lastPage || loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
