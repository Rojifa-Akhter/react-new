<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewLeaveRequest;
use App\Http\Requests\StoreLeaveRequest;
use App\Models\LeaveRequest;
use App\Services\LeaveRequestService;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function __construct(
        private LeaveRequestService $leaveService
    ) {}

    public function index(Request $request)
    {
        $leaves = $this->leaveService->getLeavesForUser(
            $request->user(),
            $request->query('status')
        );

        return response()->json([
            'success' => true,
            'data' => $leaves,
        ]);
    }

    public function store(StoreLeaveRequest $request)
    {
        $employee = $request->user()->employee;

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee profile not found.',
            ], 403);
        }

        $leave = $this->leaveService->createLeave(
            $employee->id,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Leave request submitted successfully.',
            'data' => $leave,
        ], 201);
    }

    public function show(Request $request, LeaveRequest $leaveRequest)
    {
        $user = $request->user();

        $isAdminOrHr = in_array($user->role, ['Admin', 'HR'], true);
        $employee = $user->employee;

        if (
            ! $isAdminOrHr &&
            (! $employee || (int) $leaveRequest->employee_id !== (int) $employee->id)
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $leaveRequest->load(['employee', 'approver']),
        ]);
    }

    public function review(
        ReviewLeaveRequest $request,
        LeaveRequest $leaveRequest
    ) {
        $user = $request->user();

        // Adjust this check to match your actual role field and values.
        abort_unless(
            in_array($user->role ?? null, ['Admin', 'HR'], true),
            403,
            'Only Admin or HR can review leave requests.'
        );

        $leave = $this->leaveService->reviewLeave(
            $leaveRequest,
            $user->id,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Leave request reviewed successfully.',
            'data' => $leave,
        ]);
    }

    public function destroy(
        Request $request,
        LeaveRequest $leaveRequest
    ) {
        $employee = $request->user()->employee;

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee profile not found.',
            ], 403);
        }

        $this->leaveService->cancelLeave(
            $leaveRequest,
            $employee->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Leave request cancelled successfully.',
        ]);
    }
}
