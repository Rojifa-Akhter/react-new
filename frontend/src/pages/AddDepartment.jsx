
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DepartmentForm from '../components/DepartmentForm';

function AddDepartment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (formData) => {
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            await api.post('/departments', formData);

            setSuccessMessage('Department created successfully!');

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
                        'Something went wrong. Please try again.',
                    ],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {successMessage && (
                <div className="mx-8 mt-8 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            <DepartmentForm
                onSubmit={handleSubmit}
                loading={loading}
                errors={errors}
                submitText="Save Department"
                title="Add Department"
                description="Add a new department to your organization."
                onCancel={() => navigate('/departments')}
            />
        </>
    );
}

export default AddDepartment;
