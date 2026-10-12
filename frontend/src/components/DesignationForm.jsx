import { useEffect, useState } from 'react';

const emptyForm = {
    name: '',
    code: '',
    description: '',
    status: 'Active',
};

export default function DesignationForm({
    initialData = null,
    onSubmit,
    loading = false,
    errors = {},
    submitText = 'Save Designation',
    title = 'Designation Form',
    description = 'Enter designation information below.',
    onCancel,
}) {
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name ?? '',
                code: initialData.code ?? '',
                description: initialData.description ?? '',
                status: initialData.status ?? 'Active',
            });
        } else {
            setFormData(emptyForm);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const fieldError = (field) => {
        const error = errors[field];
        return Array.isArray(error) ? error[0] : error;
    };

    const inputClass = (field) =>
        `mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldError(field) ? 'border-red-500' : 'border-gray-300'
        }`;

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Designation Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass('name')}
                        placeholder="e.g. Software Engineer"
                        required
                        maxLength={255}
                    />
                    {fieldError('name') && (
                        <p className="mt-1 text-sm text-red-600">
                            {fieldError('name')}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Designation Code *
                    </label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className={inputClass('code')}
                        placeholder="e.g. SE-001"
                        required
                        maxLength={50}
                    />
                    {fieldError('code') && (
                        <p className="mt-1 text-sm text-red-600">
                            {fieldError('code')}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
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
                    {fieldError('status') && (
                        <p className="mt-1 text-sm text-red-600">
                            {fieldError('status')}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={inputClass('description')}
                        placeholder="Enter designation description"
                        rows={4}
                    />
                    {fieldError('description') && (
                        <p className="mt-1 text-sm text-red-600">
                            {fieldError('description')}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Saving...' : submitText}
                    </button>
                </div>
            </form>
        </div>
    );
}
