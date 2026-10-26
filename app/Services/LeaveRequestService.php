<?php

namespace App\Services;

use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Nette\Schema\ValidationException;

class LeaveRequestService
{
    public function getLeavesForUser(User $user, ?string $status = null)
    {
        $query = LeaveRequest::with(['employee', 'approver'])
            ->latest();

        // Admin and HR can see all employee leave requests
        if (! in_array($user->role, ['Admin', 'HR'], true)) {
            $employee = $user->employee;

            if (! $employee) {
                abort(403, 'Employee profile not found.');
            }

            $query->where('employee_id', $employee->id);
        }

        // Optional status filter
        if ($status && in_array($status, ['Pending', 'Approved', 'Rejected'], true)) {
            $query->where('status', $status);
        }

        return $query->paginate(10);
    }
    public function getEmployeeLeaves(int $employeeId)
    {
        return LeaveRequest::where('employee_id', $employeeId)
            ->with('approver')
            ->latest()
            ->paginate(10);
    }

    public function createLeave(int $employeeId, array $data): LeaveRequest
    {
        return LeaveRequest::create([
            ...$data,
            'employee_id' => $employeeId,
            'status' => 'Pending',
            'approved_by' => null,
        ]);
    }

    public function reviewLeave(
        LeaveRequest $leave,
        int $userId,
        array $data
    ): LeaveRequest {
        return DB::transaction(function () use ($leave, $userId, $data) {
            $lockedLeave = LeaveRequest::whereKey($leave->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedLeave->status !== 'Pending') {
                throw ValidationException::withMessages([
                    'status' => 'This leave request has already been reviewed.',
                ]);
            }

            $lockedLeave->update([
                'status' => $data['status'],
                'admin_remarks' => $data['admin_remarks'] ?? null,
                'approved_by' => $userId,
            ]);

            return $lockedLeave->fresh()->load('approver');
        });
    }

    public function cancelLeave(
        LeaveRequest $leave,
        int $employeeId
    ): void {
        if ((int) $leave->employee_id !== $employeeId) {
            abort(403, 'Unauthorized.');
        }

        if ($leave->status !== 'Pending') {
            throw ValidationException::withMessages([
                'leave' => 'Only pending leave requests can be cancelled.',
            ]);
        }

        $leave->delete();
    }
}
