
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joining_date: "",
    status: "Active",
};

export default function EditEmployeeProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const loadEmployee = async () => {
            try {
                const response = await api.get(`/employees/${id}`);
                const employee = response.data.data ?? response.data;

                setForm({
                    name: employee.name ?? "",
                    email: employee.email ?? "",
                    phone: employee.phone ?? "",
                    department: employee.department ?? "",
                    designation: employee.designation ?? "",
                    salary: employee.salary ?? "",
                    joining_date: employee.joining_date
                        ? String(employee.joining_date).slice(0, 10)
                        : "",
                    status: employee.status ?? "Active",
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ??
                    "Employee information load করা যায়নি।"
                );
            } finally {
                setLoading(false);
            }
        };

        loadEmployee();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setValidationErrors((previous) => ({
            ...previous,
            [name]: [],
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setValidationErrors({});

        try {
            await api.put(`/employees/${id}`, {
                ...form,
                salary: Number(form.salary),
            });

            navigate(`/employees/${id}/profile`);
        } catch (err) {
            if (err.response?.status === 422) {
                setValidationErrors(err.response.data.errors ?? {});
                setError("তথ্যগুলো যাচাই করে আবার চেষ্টা করো।");
            } else {
                setError(
                    err.response?.data?.message ??
                    "Employee profile update করা যায়নি।"
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { name: "name", label: "Full Name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone Number" },
        { name: "department", label: "Department" },
        { name: "designation", label: "Designation" },
        { name: "salary", label: "Salary", type: "number", required: true },
        { name: "joining_date", label: "Joining Date", type: "date" },
    ];

    if (loading) {
        return <div className="p-8 text-gray-500">Loading employee...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Employee Profile
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Update employee information
                        </p>
                    </div>

                    <Link
                        to={`/employees/${id}/profile`}
                        className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Cancel
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
                >
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.name}>
                                <label
                                    htmlFor={field.name}
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    {field.label}
                                    {field.required && " *"}
                                </label>

                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type ?? "text"}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    min={field.name === "salary" ? "0" : undefined}
                                    step={field.name === "salary" ? "0.01" : undefined}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                                {validationErrors[field.name]?.map((message) => (
                                    <p
                                        key={message}
                                        className="mt-1 text-sm text-red-600"
                                    >
                                        {message}
                                    </p>
                                ))}
                            </div>
                        ))}

                        <div>
                            <label
                                htmlFor="status"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Employment Status *
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            {validationErrors.status?.map((message) => (
                                <p key={message} className="mt-1 text-sm text-red-600">
                                    {message}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-5">
                        <Link
                            to={`/employees/${id}/profile`}
                            className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
