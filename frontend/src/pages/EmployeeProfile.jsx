
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

const money = (value) =>
    `৳${Number(value ?? 0).toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function EmployeeProfile() {
    const { id } = useParams();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/employees/${id}/profile`
                );

                setEmployee(response.data.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Employee profile load করা যায়নি।"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="p-8 text-gray-500">
                Loading employee profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="m-6 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
            </div>
        );
    }

    if (!employee) return null;

    const payrolls = employee.payrolls ?? [];

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Employee Profile
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Employee details and salary history
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to={`/employees/${employee.id}/profile/edit`}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Edit Profile
                        </Link>

                        <Link
                            to="/employees"
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            ← Back to Employees
                        </Link>
                    </div>
                </div>

                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                            {(employee.name ?? employee.user?.name ?? "E")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {employee.name ??
                                    employee.user?.name ??
                                    "Unnamed Employee"}
                            </h2>

                            <p className="text-sm text-gray-500">
                                {employee.designation?.name ??
                                    "Designation not assigned"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                {employee.user?.email ??
                                    employee.email ??
                                    "No email"}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold text-gray-800">
                        Personal & Job Information
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <Info label="Employee ID" value={employee.id} />

                        <Info
                            label="Name"
                            value={employee.name ?? employee.user?.name}
                        />

                        <Info
                            label="Email"
                            value={employee.user?.email ?? employee.email}
                        />

                        <Info
                            label="Phone"
                            value={employee.phone ?? employee.phone_number}
                        />

                        <Info
                            label="Department"
                            value={employee.department?.name}
                        />

                        <Info
                            label="Designation"
                            value={employee.designation?.name}
                        />

                        <Info
                            label="Joining Date"
                            value={employee.joining_date ?? employee.join_date}
                        />

                        <Info
                            label="Employment Status"
                            value={employee.status}
                        />
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Salary History
                        </h2>

                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                            {payrolls.length} records
                        </span>
                    </div>

                    {payrolls.length === 0 ? (
                        <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
                            No salary records found for this employee.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3">Month</th>
                                        <th className="px-4 py-3">Basic</th>
                                        <th className="px-4 py-3">Allowances</th>
                                        <th className="px-4 py-3">Deductions</th>
                                        <th className="px-4 py-3">Net Salary</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {payrolls.map((payroll) => (
                                        <tr key={payroll.id}>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {payroll.salary_month}
                                            </td>

                                            <td className="px-4 py-3">
                                                {money(payroll.basic_salary)}
                                            </td>

                                            <td className="px-4 py-3">
                                                {money(payroll.allowances)}
                                            </td>

                                            <td className="px-4 py-3">
                                                {money(payroll.deductions)}
                                            </td>

                                            <td className="px-4 py-3 font-semibold">
                                                {money(payroll.net_salary)}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${payroll.status === "Paid"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {payroll.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 break-words font-medium text-gray-800">
                {value || "Not provided"}
            </p>
        </div>
    );
}
