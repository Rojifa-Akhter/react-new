import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../api';
import EmployeeForm from '../components/EmployeeForm';

function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const fetchEmployee = async () => {
        try {
            const response = await api.get(`/employees/${id}`);

            setEmployee(response.data.data);
        } catch (error) {
            console.error(error);

            setErrors({
                general: ['Employee not found.'],
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const handleSubmit = async (formData) => {
        setSaving(true);
        setErrors({});
        setSuccessMessage('');

        try {
            await api.put(`/employees/${id}`, formData);

            setSuccessMessage('Employee updated successfully!');

            setTimeout(() => {
                navigate('/employees');
            }, 1000);

        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setErrors({
                    general: [
                        'Something went wrong. Please try again.'
                    ],
                });
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Loading employee...
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="p-8">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errors.general?.[0] || 'Employee not found.'}
                </div>
            </div>
        );
    }

    return (
        <>
            {successMessage && (
                <div className="mx-8 mt-8 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            <EmployeeForm
                initialData={employee}
                onSubmit={handleSubmit}
                loading={saving}
                errors={errors}
                submitText="Update Employee"
                title="Edit Employee"
                description="Update employee information."
                onCancel={() => navigate('/employees')}
            />
        </>
    );
}

export default EditEmployee;
