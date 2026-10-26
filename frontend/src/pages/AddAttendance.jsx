import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AttendanceForm from '../components/AttendanceForm';

export default function AddAttendance() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        api.get('/attendance/employees')
            .then((response) => setEmployees(response.data.data ?? []))
            .catch((error) => {
                setErrorMessage(
                    error.response?.data?.message ?? 'Failed to load employees.'
                );
            })
            .finally(() => setLoadingEmployees(false));
    }, []);

    const handleSubmit = async (formData) => {
        setSaving(true);
        setErrors({});
        setErrorMessage('');

        try {
            await api.post('/attendance', formData);
            window.alert('Attendance created successfully.');
            navigate('/attendance');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                setErrorMessage(
                    error.response?.data?.message ?? 'Failed to create attendance.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loadingEmployees) {
        return <p className="py-10 text-center text-gray-500">Loading employees...</p>;
    }

    return (
        <div className="p-8">
            {errorMessage && (
                <div className="mx-auto mb-4 max-w-3xl rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            {employees.length === 0 ? (
                <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
                    No active employees found. Create an employee first.
                </div>
            ) : (
                <AttendanceForm
                    title="Add Attendance"
                    employees={employees}
                    onSubmit={handleSubmit}
                    loading={saving}
                    errors={errors}
                    submitText="Create Attendance"
                    onCancel={() => navigate('/attendance')}
                />
            )}
        </div>
    );
}
