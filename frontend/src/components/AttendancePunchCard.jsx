import { useCallback, useEffect, useState } from 'react';
import api from '../api';

export default function AttendancePunchCard() {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchTodayAttendance = useCallback(async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await api.get('/attendance/today');
            setAttendance(response.data.data ?? null);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ??
                'Could not load today attendance.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTodayAttendance();
    }, [fetchTodayAttendance]);

    const handlePunch = async (action) => {
        setProcessing(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await api.post(`/attendance/${action}`);

            setAttendance(response.data.data);
            setSuccessMessage(response.data.message);
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const firstValidationError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            setErrorMessage(
                firstValidationError ??
                error.response?.data?.message ??
                'Attendance action failed.'
            );
        } finally {
            setProcessing(false);
        }
    };

    const formatTime = (time) => {
        if (!time) return '—';

        const [hours, minutes] = time.slice(0, 5).split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;

        return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const checkedIn = Boolean(attendance?.check_in);
    const checkedOut = Boolean(attendance?.check_out);

    return (
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        My Attendance
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Check in when you arrive and check out when you leave.
                    </p>
                </div>

                {attendance?.status && (
                    <span className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                        attendance.status === 'Late'
                            ? 'bg-amber-100 text-amber-700'
                            : attendance.status === 'Present'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                    }`}>
                        {attendance.status}
                    </span>
                )}
            </div>

            {errorMessage && (
                <div role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            {loading ? (
                <p className="py-10 text-center text-gray-500">
                    Loading attendance...
                </p>
            ) : (
                <>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Check-in time</p>
                            <p className="mt-2 text-2xl font-semibold text-gray-800">
                                {formatTime(attendance?.check_in)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Check-out time</p>
                            <p className="mt-2 text-2xl font-semibold text-gray-800">
                                {formatTime(attendance?.check_out)}
                            </p>
                        </div>
                    </div>

                    {attendance && (
                        <p className="mt-4 text-sm text-gray-500">
                            Late minutes: {attendance.late_minutes ?? 0}
                        </p>
                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => handlePunch('check-in')}
                            disabled={processing || checkedIn || checkedOut}
                            className="flex-1 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {processing && !checkedIn
                                ? 'Processing...'
                                : checkedIn
                                    ? 'Checked In'
                                    : 'Check In'}
                        </button>

                        <button
                            type="button"
                            onClick={() => handlePunch('check-out')}
                            disabled={processing || !checkedIn || checkedOut}
                            className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {processing && checkedIn && !checkedOut
                                ? 'Processing...'
                                : checkedOut
                                    ? 'Checked Out'
                                    : 'Check Out'}
                        </button>
                    </div>

                    {checkedOut && (
                        <p className="mt-4 text-center text-sm text-green-700">
                            Your attendance for today is complete.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
