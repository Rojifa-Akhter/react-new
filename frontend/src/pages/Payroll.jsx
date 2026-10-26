import { useCallback, useEffect, useState } from "react";
import api from "../api";

const currentMonth = new Date().toISOString().slice(0, 7);

const initialForm = {
    employee_id: "",
    salary_month: currentMonth,
    basic_salary: "",
    allowances: "0",
    deductions: "0",
    remarks: "",
};

export default function Payroll() {
    const [employees, setEmployees] = useState([]);
    const [payrolls, setPayrolls] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [statusFilter, setStatusFilter] = useState("All");
    const [monthFilter, setMonthFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const basic = Number(form.basic_salary) || 0;
    const allowances = Number(form.allowances) || 0;
    const deductions = Number(form.deductions) || 0;
    const netSalary = basic + allowances - deductions;

    const fetchEmployees = async () => {
        try {
            const response = await api.get("/employees");
            const result = response.data.data;
            setEmployees(
                Array.isArray(result) ? result : result?.data ?? []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Employee list load করা যায়নি।"
            );
        }
    };

    const fetchPayrolls = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const params = {};

            if (statusFilter !== "All") {
                params.status = statusFilter;
            }

            if (monthFilter) {
                params.salary_month = monthFilter;
            }

            const response = await api.get("/payrolls", { params });
            const result = response.data.data;

            setPayrolls(
                Array.isArray(result) ? result : result?.data ?? []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Payroll list load করা যায়নি।"
            );
        } finally {
            setLoading(false);
        }
    }, [statusFilter, monthFilter]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchPayrolls();
    }, [fetchPayrolls]);

    const handleChange = (e) => {
        setForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (deductions > basic + allowances) {
            setError("Deductions gross salary-এর চেয়ে বেশি হতে পারবে না।");
            return;
        }

        setSaving(true);

        try {
            await api.post("/payrolls", {
                ...form,
                basic_salary: basic,
                allowances,
                deductions,
            });

            setForm(initialForm);
            setSuccess("Payroll successfully created.");
            await fetchPayrolls();
        } catch (err) {
            const errors = err.response?.data?.errors;

            setError(
                errors
                    ? Object.values(errors).flat().join(" ")
                    : err.response?.data?.message ||
                      "Payroll create করা যায়নি।"
            );
        } finally {
            setSaving(false);
        }
    };

    const markAsPaid = async (payroll) => {
        if (!window.confirm("এই payroll-টি Paid হিসেবে চিহ্নিত করবে?")) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await api.patch(`/payrolls/${payroll.id}/status`, {
                status: "Paid",
            });

            setSuccess("Payroll status updated to Paid.");
            await fetchPayrolls();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Payroll status update করা যায়নি।"
            );
        }
    };

    const deletePayroll = async (payroll) => {
        if (!window.confirm("এই payroll record delete করবে?")) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await api.delete(`/payrolls/${payroll.id}`);
            setSuccess("Payroll deleted successfully.");
            await fetchPayrolls();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Payroll delete করা যায়নি।"
            );
        }
    };

    const formatMoney = (amount) =>
        Number(amount || 0).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const statusClass = (status) =>
        status === "Paid"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700";

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Payroll Management
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Create salary records and manage monthly payroll.
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
            >
                <h2 className="text-lg font-semibold text-gray-800">
                    Create Payroll
                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Employee
                        </label>
                        <select
                            name="employee_id"
                            value={form.employee_id}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 p-3"
                        >
                            <option value="">Select Employee</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name} (ID: {employee.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Salary Month
                        </label>
                        <input
                            type="month"
                            name="salary_month"
                            value={form.salary_month}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Basic Salary
                        </label>
                        <input
                            type="number"
                            name="basic_salary"
                            value={form.basic_salary}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                            className="w-full rounded-lg border border-gray-300 p-3"
                            placeholder="Enter basic salary"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Allowances
                        </label>
                        <input
                            type="number"
                            name="allowances"
                            value={form.allowances}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full rounded-lg border border-gray-300 p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Deductions
                        </label>
                        <input
                            type="number"
                            name="deductions"
                            value={form.deductions}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full rounded-lg border border-gray-300 p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Remarks
                        </label>
                        <input
                            type="text"
                            name="remarks"
                            value={form.remarks}
                            onChange={handleChange}
                            maxLength={2000}
                            className="w-full rounded-lg border border-gray-300 p-3"
                            placeholder="Optional remarks"
                        />
                    </div>
                </div>

                <div className="rounded-lg bg-indigo-50 p-4">
                    <p className="text-sm text-gray-600">
                        Net Salary
                    </p>
                    <p className="mt-1 text-2xl font-bold text-indigo-700">
                        ৳ {formatMoney(netSalary)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        Basic Salary + Allowances − Deductions
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={saving || employees.length === 0 || netSalary < 0}
                    className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Create Payroll"}
                </button>
            </form>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Payroll Records
                    </h2>

                    <div className="flex flex-wrap gap-3">
                        <input
                            type="month"
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 p-2 text-sm"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 p-2 text-sm"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="p-6 text-gray-500">Loading payroll...</p>
                ) : payrolls.length === 0 ? (
                    <p className="p-6 text-gray-500">
                        No payroll records found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-4">Employee</th>
                                    <th className="p-4">Month</th>
                                    <th className="p-4">Basic</th>
                                    <th className="p-4">Allowances</th>
                                    <th className="p-4">Deductions</th>
                                    <th className="p-4">Net Salary</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {payrolls.map((payroll) => (
                                    <tr key={payroll.id}>
                                        <td className="whitespace-nowrap p-4">
                                            {payroll.employee?.name ??
                                                `Employee #${payroll.employee_id}`}
                                        </td>
                                        <td className="whitespace-nowrap p-4">
                                            {payroll.salary_month}
                                        </td>
                                        <td className="whitespace-nowrap p-4">
                                            ৳ {formatMoney(payroll.basic_salary)}
                                        </td>
                                        <td className="whitespace-nowrap p-4">
                                            ৳ {formatMoney(payroll.allowances)}
                                        </td>
                                        <td className="whitespace-nowrap p-4">
                                            ৳ {formatMoney(payroll.deductions)}
                                        </td>
                                        <td className="whitespace-nowrap p-4 font-semibold">
                                            ৳ {formatMoney(payroll.net_salary)}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(payroll.status)}`}
                                            >
                                                {payroll.status}
                                            </span>
                                        </td>
                                        <td className="space-x-3 whitespace-nowrap p-4">
                                            {payroll.status === "Pending" && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => markAsPaid(payroll)}
                                                        className="font-medium text-green-600 hover:text-green-800"
                                                    >
                                                        Mark Paid
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => deletePayroll(payroll)}
                                                        className="font-medium text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}

                                            {payroll.status === "Paid" && (
                                                <span className="text-gray-400">
                                                    Completed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
