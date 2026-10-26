import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DesignationForm from '../components/DesignationForm';

export default function AddDesignation() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (formData) => {
        setLoading(true);
        setErrors({});
        setErrorMessage('');

        try {
            await api.post('/designations', formData);

            window.alert('Designation created successfully.');
            navigate('/designations');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                setErrorMessage(
                    error.response?.data?.message ??
                    'Failed to create designation.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            {errorMessage && (
                <div className="mx-auto mb-4 max-w-3xl rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <DesignationForm
                title="Add Designation"
                description="Create a new designation for your company."
                onSubmit={handleSubmit}
                loading={loading}
                errors={errors}
                submitText="Create Designation"
                onCancel={() => navigate('/designations')}
            />
        </div>
    );
}
