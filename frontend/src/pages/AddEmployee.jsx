import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api';
import EmployeeForm from '../components/EmployeeForm';

function AddEmployee() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (formData) => {
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            await api.post('/employees', formData);

            setSuccessMessage('Employee created successfully!');

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

            <EmployeeForm
                onSubmit={handleSubmit}
                loading={loading}
                errors={errors}
                submitText="Save Employee"
                title="Add Employee"
                description="Add a new employee to your organization."
                onCancel={() => navigate('/employees')}
            />
        </>
    );
}

export default AddEmployee;
