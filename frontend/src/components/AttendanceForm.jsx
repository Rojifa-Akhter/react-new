import { useEffect, useState } from 'react';

const emptyForm = {
    employee_id: '',
    attendance_date: '',
    check_in: '',
    check_out: '',
    status: 'Present',
    notes: '',
};

const statuses = ['Present', 'Absent', 'Late', 'Half Day', 'Leave'];

export default function AttendanceForm({
    initialData = null,
    employees = [],
    onSubmit,
    loading = false,
    errors = {},
    submitText = 'Save Attendance',
    title = 'Attendance Form',
    onCancel,
}) {
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (initialData) {
            setFormData({
                employee_id: String(initialData.employee_id ?? ''),
                attendance_date: String(
                    initialData.attendance_date ?? ''
                ).slice(0, 10),
                check_in: initialData.check_in?.slice(0, 5) ?? '',
                check_out: initialData.check_out?.slice(0, 5) ?? '',
                status: initialData.status ?? 'Present',
                notes: initialData.notes ?? '',
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

    const getError = (field) => {
        const error = errors[field];
        return Array.isArray(error) ? error[0] : error;
    };

    const inputClass = (field) =>
        `mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
            getError(field) ? 'border-red-500' : 'border-gray-300'
        }`;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="mb-1 text-2xl font-bold text-gray-800">
                {title}
            </h1>
            <p className="mb-6 text-sm text-gray-500">
                Record employee attendance and working times.
            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Employee *
                    </label>
                    <select
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        className={inputClass('employee_id')}
                        required
                    >
                        <option value="">Select employee</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name} — {employee.email}
                            </option>
                        ))}
                    </select>
                    {getError('employee_id') && (
                        <p className="mt-1 text-sm text-red-600">
                            {getError('employee_id')}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Attendance Date *
                    </label>
                    <input
                        type="date"
                        name="attendance_date"
                        value={formData.attendance_date}
                        onChange={handleChange}
                        className={inputClass('attendance_date')}
                        required
                    />
                    {getError('attendance_date') && (
                        <p className="mt-1 text-sm text-red-600">
                            {getError('attendance_date')}
                        </p>
                    )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Check-in
                        </label>
                        <input
                            type="time"
                            name="check_in"
                            value={formData.check_in}
                            onChange={handleChange}
                            disabled={['Absent', 'Leave'].includes(formData.status)}
                            className={inputClass('check_in')}
                        />
                        {getError('check_in') && (
                            <p className="mt-1 text-sm text-red-600">
                                {getError('check_in')}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Check-out
                        </label>
                        <input
                            type="time"
                            name="check_out"
                            value={formData.check_out}
                            onChange={handleChange}
                            disabled={['Absent', 'Leave'].includes(formData.status)}
                            className={inputClass('check_out')}
                        />
                        {getError('check_out') && (
                            <p className="mt-1 text-sm text-red-600">
                                {getError('check_out')}
                            </p>
                        )}
                    </div>
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
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    {getError('status') && (
                        <p className="mt-1 text-sm text-red-600">
                            {getError('status')}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Office start: 9:00 AM. Late minutes are calculated by the server.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Notes
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className={inputClass('notes')}
                        placeholder="Optional notes..."
                    />
                    {getError('notes') && (
                        <p className="mt-1 text-sm text-red-600">
                            {getError('notes')}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : submitText}
                    </button>
                </div>
            </form>
        </div>
    );
}
