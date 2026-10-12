
import { useEffect, useState } from 'react';

function DepartmentForm({
    initialData = null,
    onSubmit,
    loading = false,
    errors = {},
    submitText = 'Save Department',
    title = 'Add Department',
    description = 'Create a new department.',
    onCancel,
}) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        status: 'Active',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name ?? '',
                code: initialData.code ?? '',
                description: initialData.description ?? '',
                status: initialData.status ?? 'Active',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const inputClass = (field) =>
        `w-full rounded-lg border ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
        } px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`;

    const showError = (field) =>
        errors[field] ? (
            <p className="mt-1 text-xs text-red-600">
                {errors[field][0]}
            </p>
        ) : null;

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            {errors.general && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {errors.general[0]}
                </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Department Name *
                            </label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass('name')}
                                placeholder="e.g. Human Resources"
                                required
                            />
                            {showError('name')}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Department Code *
                            </label>
                            <input
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className={inputClass('code')}
                                placeholder="e.g. HR"
                                required
                            />
                            {showError('code')}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Status *
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={inputClass('status')}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {showError('status')}
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className={inputClass('description')}
                                placeholder="Write department details..."
                            />
                            {showError('description')}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DepartmentForm;
