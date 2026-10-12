
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import DepartmentForm from '../components/DepartmentForm';

function EditDepartment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchDepartment = async () => {
            setLoading(true);

            try {
                const response = await api.get(`/departments/${id}`);
                setDepartment(response.data.data);
                setErrors({});
            } catch (error) {
                setErrors({
                    general: [
                        error.response?.data?.message ||
                        'Department not found.',
                    ],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDepartment();
    }, [id]);

    const handleSubmit = async (formData) => {
        setSaving(true);
        setErrors({});
        setSuccessMessage('');

        try {
            await api.put(`/departments/${id}`, formData);

            setSuccessMessage('Department updated successfully!');

            setTimeout(() => {
                navigate('/departments');
            }, 700);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setErrors({
                    general: [
                        error.response?.data?.message ||
                        'Failed to update department.',
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
                Loading department...
            </div>
        );
    }

    if (!department) {
        return (
            <div className="p-8">
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errors.general?.[0] || 'Department not found.'}
                </div>

                <button
                    onClick={() => navigate('/departments')}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                >
                    Back to Departments
                </button>
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

            <DepartmentForm
                initialData={department}
                onSubmit={handleSubmit}
                loading={saving}
                errors={errors}
                submitText="Update Department"
                title="Edit Department"
                description="Update department information."
                onCancel={() => navigate('/departments')}
            />
        </>
    );
}

export default EditDepartment;
