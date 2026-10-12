<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Nette\Schema\ValidationException;

class AttendanceService
{
    private const OFFICE_START_TIME = '09:00';

    public function getAll(
        ?string $search = null,
        ?string $date = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        return Attendance::with('employee:id,name,email')
            ->when($search, function ($query) use ($search) {
                $query->whereHas('employee', function ($employeeQuery) use ($search) {
                    $employeeQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($date, fn($query) => $query->whereDate('attendance_date', $date))
            ->latest('attendance_date')
            ->latest('id')
            ->paginate($perPage);
    }

    public function create(array $data): Attendance
    {
        $this->calculateAttendance($data);

        return DB::transaction(function () use ($data) {
            $exists = Attendance::where('employee_id', $data['employee_id'])
                ->whereDate('attendance_date', $data['attendance_date'])
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'attendance_date' => [
                        'Attendance already exists for this employee and date.',
                    ],
                ]);
            }

            return Attendance::create($data)->load('employee');
        });
    }

    public function find(Attendance $attendance): Attendance
    {
        return $attendance->load('employee');
    }

    public function update(Attendance $attendance, array $data): Attendance
    {
        $this->calculateAttendance($data);

        return DB::transaction(function () use ($attendance, $data) {
            $exists = Attendance::where('employee_id', $data['employee_id'])
                ->whereDate('attendance_date', $data['attendance_date'])
                ->where('id', '!=', $attendance->id)
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'attendance_date' => [
                        'Attendance already exists for this employee and date.',
                    ],
                ]);
            }

            $attendance->update($data);

            return $attendance->fresh()->load('employee');
        });
    }

    public function delete(Attendance $attendance): bool
    {
        return (bool) $attendance->delete();
    }

    private function calculateAttendance(array &$data): void
    {
        $data['late_minutes'] = 0;

        // Absent/Leave hole check-in time thakleo late calculate korbo na.
        if (in_array($data['status'], ['Absent', 'Leave'], true)) {
            $data['check_in'] = null;
            $data['check_out'] = null;

            return;
        }

        if (empty($data['check_in'])) {
            if ($data['status'] === 'Late') {
                throw ValidationException::withMessages([
                    'check_in' => ['Late status requires a check-in time.'],
                ]);
            }

            return;
        }

        $checkIn = substr($data['check_in'], 0, 5);
        $officeStart = self::OFFICE_START_TIME;

        if ($checkIn > $officeStart) {
            [$hour, $minute] = array_map('intval', explode(':', $checkIn));
            [$startHour, $startMinute] = array_map(
                'intval',
                explode(':', $officeStart)
            );

            $data['late_minutes'] =
                ($hour * 60 + $minute) - ($startHour * 60 + $startMinute);

            if (in_array($data['status'], ['Present', 'Late'], true)) {
                $data['status'] = 'Late';
            }
        } elseif (in_array($data['status'], ['Present', 'Late'], true)) {
            $data['status'] = 'Present';
        }
    }
    public function getTodayAttendance(Employee $employee): ?Attendance
    {
        return Attendance::where('employee_id', $employee->id)
            ->whereDate('attendance_date', now()->toDateString())
            ->first();
    }

    public function checkIn(Employee $employee): Attendance
    {
        return DB::transaction(function () use ($employee) {
            $today = now()->toDateString();

            $attendance = Attendance::where('employee_id', $employee->id)
                ->whereDate('attendance_date', $today)
                ->lockForUpdate()
                ->first();

            if ($attendance) {
                throw ValidationException::withMessages([
                    'check_in' => [
                        'You have already checked in or have an attendance record for today.',
                    ],
                ]);
            }

            $now = now();
            $officeStart = $now->copy()->setTime(9, 0, 0);

            $lateMinutes = $now->greaterThan($officeStart)
                ? (int) $officeStart->diffInMinutes($now)
                : 0;

            return Attendance::create([
                'employee_id' => $employee->id,
                'attendance_date' => $today,
                'check_in' => $now->format('H:i:s'),
                'check_out' => null,
                'status' => $lateMinutes > 0 ? 'Late' : 'Present',
                'late_minutes' => $lateMinutes,
            ])->load('employee');
        });
    }

    public function checkOut(Employee $employee): Attendance
    {
        return DB::transaction(function () use ($employee) {
            $attendance = Attendance::where('employee_id', $employee->id)
                ->whereDate('attendance_date', now()->toDateString())
                ->lockForUpdate()
                ->first();

            if (!$attendance || !$attendance->check_in) {
                throw ValidationException::withMessages([
                    'check_out' => [
                        'You must check in before checking out.',
                    ],
                ]);
            }

            if ($attendance->check_out) {
                throw ValidationException::withMessages([
                    'check_out' => [
                        'You have already checked out today.',
                    ],
                ]);
            }

            $now = now();
            $checkIn = now()->parse(
                $attendance->attendance_date->format('Y-m-d')
                    . ' ' . $attendance->check_in
            );

            if ($now->lessThan($checkIn)) {
                throw ValidationException::withMessages([
                    'check_out' => [
                        'Check-out time cannot be earlier than check-in time.',
                    ],
                ]);
            }

            $attendance->update([
                'check_out' => $now->format('H:i:s'),
            ]);

            return $attendance->fresh()->load('employee');
        });
    }
}
