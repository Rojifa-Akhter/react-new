import { useCallback, useEffect, useState } from "react";
import api from "../api";

export default function LeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [role, setRole] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [reviewingId, setReviewingId] = useState(null);
    const [remarks, setRemarks] = useState({});

    const [form, setForm] = useState({
        leave_type: "Casual",
        start_date: "",
        end_date: "",
        reason: "",
    });

    const isAdminOrHr = ["Admin", "HR"].includes(role);

    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const params =
                statusFilter !== "All"
                    ? { status: statusFilter }
                    : {};

            const response = await api.get("/leave-requests", { params });
            const result = response.data.data;

            setLeaves(
                Array.isArray(result)
                    ? result
                    : result?.data ?? []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Leave requests load করা যায়নি।"
            );
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/auth/me");
                const user = response.data.user ?? response.data.data ?? response.data;

                setRole(user.role ?? "");
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "User information load করা যায়নি।"
                );
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (role) {
            fetchLeaves();
        }
    }, [role, fetchLeaves]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await api.post("/leave-requests", form);

            setForm({
                leave_type: "Casual",
                start_date: "",
                end_date: "",
                reason: "",
            });

            setSuccess("Leave application সফলভাবে submit হয়েছে।");
            await fetchLeaves();
        } catch (err) {
            const errors = err.response?.data?.errors;

            setError(
                errors
                    ? Object.values(errors).flat().join(" ")
                    : err.response?.data?.message ||
                      "Leave application submit করা যায়নি।"
            );
        }
    };

    const cancelLeave = async (id) => {
        if (!window.confirm("এই leave application বাতিল করবে?")) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await api.delete(`/leave-requests/${id}`);
            setSuccess("Leave application বাতিল হয়েছে।");
            await fetchLeaves();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Leave application বাতিল করা যায়নি।"
            );
        }
    };

    const reviewLeave = async (leave, status) => {
        const action = status === "Approved" ? "Approve" : "Reject";

        if (!window.confirm(`এই leave application ${action} করবে?`)) {
            return;
        }

        setError("");
        setSuccess("");
        setReviewingId(leave.id);

        try {
            await api.patch(`/leave-requests/${leave.id}/review`, {
                status,
                admin_remarks: remarks[leave.id] || "",
            });

            setSuccess(`Leave application ${action.toLowerCase()} হয়েছে।`);

            setRemarks((previous) => ({
                ...previous,
                [leave.id]: "",
            }));

            await fetchLeaves();
        } catch (err) {
            const errors = err.response?.data?.errors;

            setError(
                errors
                    ? Object.values(errors).flat().join(" ")
                    : err.response?.data?.message ||
                      "Leave review করা যায়নি।"
            );
        } finally {
            setReviewingId(null);
        }
    };

    const statusClass = (status) => {
        if (status === "Approved") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Rejected") {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    const formatDate = (date) => {
        if (!date) return "—";
        return String(date).slice(0, 10);
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Leave Management
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    {isAdminOrHr
                        ? "Review and manage employee leave applications."
                        : "Apply for leave and track your applications."}
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

            {!isAdminOrHr && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-800">
                        Apply for Leave
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Leave Type
                            </label>

                            <select
                                name="leave_type"
                                value={form.leave_type}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 p-3"
                            >
                                <option value="Casual">Casual</option>
                                <option value="Sick">Sick</option>
                                <option value="Annual">Annual</option>
                                <option value="Unpaid">Unpaid</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="start_date"
                                value={form.start_date}
                                onChange={handleChange}
                                min={new Date().toLocaleDateString("en-CA")}
                                required
                                className="w-full rounded-lg border border-gray-300 p-3"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                End Date
                            </label>

                            <input
                                type="date"
                                name="end_date"
                                value={form.end_date}
                                onChange={handleChange}
                                min={
                                    form.start_date ||
                                    new Date().toLocaleDateString("en-CA")
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 p-3"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Reason
                            </label>

                            <textarea
                                name="reason"
                                value={form.reason}
                                onChange={handleChange}
                                required
                                maxLength={1000}
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 p-3"
                                placeholder="Enter reason for leave"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                    >
                        Submit Application
                    </button>
                </form>
            )}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {isAdminOrHr
                            ? "Employee Leave Applications"
                            : "My Leave Applications"}
                    </h2>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 p-2 text-sm"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {loading ? (
                    <p className="p-6 text-gray-500">Loading...</p>
                ) : leaves.length === 0 ? (
                    <p className="p-6 text-gray-500">
                        No leave applications found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    {isAdminOrHr && (
                                        <th className="p-4">Employee</th>
                                    )}

                                    <th className="p-4">Type</th>
                                    <th className="p-4">Start Date</th>
                                    <th className="p-4">End Date</th>
                                    <th className="p-4">Reason</th>
                                    <th className="p-4">Status</th>

                                    {isAdminOrHr && (
                                        <th className="min-w-64 p-4">
                                            Review / Remarks
                                        </th>
                                    )}

                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {leaves.map((leave) => (
                                    <tr key={leave.id}>
                                        {isAdminOrHr && (
                                            <td className="p-4">
                                                <div className="font-medium text-gray-800">
                                                    {leave.employee?.user?.name ??
                                                        leave.employee?.name ??
                                                        `Employee #${leave.employee_id}`}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ID: {leave.employee_id}
                                                </div>
                                            </td>
                                        )}

                                        <td className="p-4">
                                            {leave.leave_type}
                                        </td>

                                        <td className="whitespace-nowrap p-4">
                                            {formatDate(leave.start_date)}
                                        </td>

                                        <td className="whitespace-nowrap p-4">
                                            {formatDate(leave.end_date)}
                                        </td>

                                        <td className="max-w-xs p-4">
                                            {leave.reason}
                                            {leave.admin_remarks && (
                                                <p className="mt-2 text-xs text-gray-500">
                                                    Admin remarks: {leave.admin_remarks}
                                                </p>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(leave.status)}`}
                                            >
                                                {leave.status}
                                            </span>
                                        </td>

                                        {isAdminOrHr && (
                                            <td className="min-w-64 space-y-2 p-4">
                                                {leave.status === "Pending" ? (
                                                    <textarea
                                                        rows={2}
                                                        value={remarks[leave.id] || ""}
                                                        onChange={(e) =>
                                                            setRemarks((previous) => ({
                                                                ...previous,
                                                                [leave.id]: e.target.value,
                                                            }))
                                                        }
                                                        maxLength={1000}
                                                        placeholder="Optional remarks..."
                                                        className="w-full rounded-lg border border-gray-300 p-2"
                                                    />
                                                ) : (
                                                    <span className="text-gray-500">
                                                        {leave.admin_remarks || "No remarks"}
                                                    </span>
                                                )}
                                            </td>
                                        )}

                                        <td className="space-y-2 whitespace-nowrap p-4">
                                            {isAdminOrHr &&
                                                leave.status === "Pending" && (
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            type="button"
                                                            disabled={reviewingId === leave.id}
                                                            onClick={() =>
                                                                reviewLeave(leave, "Approved")
                                                            }
                                                            className="rounded-lg bg-green-600 px-3 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {reviewingId === leave.id
                                                                ? "Processing..."
                                                                : "Approve"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={reviewingId === leave.id}
                                                            onClick={() =>
                                                                reviewLeave(leave, "Rejected")
                                                            }
                                                            className="rounded-lg bg-red-600 px-3 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}

                                            {!isAdminOrHr &&
                                                leave.status === "Pending" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            cancelLeave(leave.id)
                                                        }
                                                        className="font-medium text-red-600 hover:text-red-800"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}

                                            {leave.status !== "Pending" && (
                                                <span className="text-gray-400">
                                                    Reviewed
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

