<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\Attendance;
use App\Models\Employee;
use App\Services\AttendanceService;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(
        protected AttendanceService $attendanceService
    ) {}

    public function index(Request $request)
    {
        $attendances = $this->attendanceService->getAll(
            $request->query('search'),
            $request->query('date'),
            max(1, min((int) $request->query('per_page', 10), 100))
        );

        return response()->json([
            'success' => true,
            'data' => $attendances,
        ]);
    }

    public function employees()
    {
        return response()->json([
            'success' => true,
            'data' => Employee::query()
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreAttendanceRequest $request)
    {
        $attendance = $this->attendanceService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Attendance created successfully.',
            'data' => $attendance,
        ], 201);
    }

    public function show(Attendance $attendance)
    {
        return response()->json([
            'success' => true,
            'data' => $this->attendanceService->find($attendance),
        ]);
    }

    public function update(
        UpdateAttendanceRequest $request,
        Attendance $attendance
    ) {
        $attendance = $this->attendanceService->update(
            $attendance,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Attendance updated successfully.',
            'data' => $attendance,
        ]);
    }

    public function destroy(Attendance $attendance)
    {
        $this->attendanceService->delete($attendance);

        return response()->json([
            'success' => true,
            'message' => 'Attendance deleted successfully.',
        ]);
    }
    private function currentEmployee(Request $request): Employee
    {
        $user = $request->user();

        abort_unless($user, 401, 'Unauthenticated.');

        // Try user_id relationship first, then fallback to email matching
        $employee = Employee::where('user_id', $user->id)->first()
            ?? Employee::where('email', $user->email)->first();

        abort_unless(
            $employee && !$employee->trashed(),
            404,
            'No active employee profile is linked to this account.'
        );

        return $employee;
    }

    public function today(Request $request)
    {
        $employee = $this->currentEmployee($request);

        return response()->json([
            'success' => true,
            'data' => $this->attendanceService->getTodayAttendance($employee),
        ]);
    }

    public function checkIn(Request $request)
    {
        $employee = $this->currentEmployee($request);

        $attendance = $this->attendanceService->checkIn($employee);

        return response()->json([
            'success' => true,
            'message' => 'Checked in successfully.',
            'data' => $attendance,
        ], 201);
    }

    public function checkOut(Request $request)
    {
        $employee = $this->currentEmployee($request);

        $attendance = $this->attendanceService->checkOut($employee);

        return response()->json([
            'success' => true,
            'message' => 'Checked out successfully.',
            'data' => $attendance,
        ]);
    }
    public function summary(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        $counts = Attendance::query()
            ->whereDate('attendance_date', $date)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'success' => true,
            'data' => [
                'present' => (int) ($counts['Present'] ?? 0),
                'late' => (int) ($counts['Late'] ?? 0),
                'absent' => (int) ($counts['Absent'] ?? 0),
                'on_leave' => (int) ($counts['Leave'] ?? 0),
            ],
        ]);
    }
}
