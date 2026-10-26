import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import DesignationForm from '../components/DesignationForm';

export default function EditDesignation() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [designation, setDesignation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let cancelled = false;

        const fetchDesignation = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await api.get(`/designations/${id}`);

                if (!cancelled) {
                    setDesignation(response.data.data);
                }
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        'Failed to load designation.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchDesignation();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleSubmit = async (formData) => {
        setSaving(true);
        setErrors({});
        setErrorMessage('');

        try {
            await api.put(`/designations/${id}`, formData);

            window.alert('Designation updated successfully.');
            navigate('/designations');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                setErrorMessage(
                    error.response?.data?.message ??
                    'Failed to update designation.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <p className="py-10 text-center text-gray-500">
                Loading designation...
            </p>
        );
    }

    if (!designation) {
        return (
            <div className="mx-auto max-w-3xl">
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                    {errorMessage || 'Designation not found.'}
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/designations')}
                    className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                    Back to Designations
                </button>
            </div>
        );
    }

    return (
        <div className="p-8">
            {errorMessage && (
                <div className="mx-auto mb-4 max-w-3xl rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <DesignationForm
                initialData={designation}
                title="Edit Designation"
                description="Update the designation information."
                onSubmit={handleSubmit}
                loading={saving}
                errors={errors}
                submitText="Update Designation"
                onCancel={() => navigate('/designations')}
            />
        </div>
    );
}
