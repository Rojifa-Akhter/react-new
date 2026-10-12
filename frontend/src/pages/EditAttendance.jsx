import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import AttendanceForm from '../components/AttendanceForm';

export default function EditAttendance() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [attendance, setAttendance] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                const [attendanceResponse, employeesResponse] = await Promise.all([
                    api.get(`/attendance/${id}`),
                    api.get('/attendance/employees'),
                ]);

                if (!cancelled) {
                    setAttendance(attendanceResponse.data.data);
                    setEmployees(employeesResponse.data.data ?? []);
                }
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage(
                        error.response?.data?.message ?? 'Failed to load attendance.'
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadData();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleSubmit = async (formData) => {
        setSaving(true);
        setErrors({});
        setErrorMessage('');

        try {
            await api.put(`/attendance/${id}`, formData);
            window.alert('Attendance updated successfully.');
            navigate('/attendance');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                setErrorMessage(
                    error.response?.data?.message ?? 'Failed to update attendance.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p className="py-10 text-center text-gray-500">Loading attendance...</p>;
    }

    if (!attendance) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                    {errorMessage || 'Attendance record not found.'}
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/attendance')}
                    className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                    Back to Attendance
                </button>
            </div>
        );
    }

    return (
        <div>
            {errorMessage && (
                <div className="mx-auto mb-4 max-w-3xl rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <AttendanceForm
                initialData={attendance}
                employees={employees}
                title="Edit Attendance"
                onSubmit={handleSubmit}
                loading={saving}
                errors={errors}
                submitText="Update Attendance"
                onCancel={() => navigate('/attendance')}
            />
        </div>
    );
}
