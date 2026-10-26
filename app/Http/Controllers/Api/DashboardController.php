<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
     public function index()
    {
        $today = now()->toDateString();

        return response()->json([
            'success' => true,
            'data' => [
                'total_employees' => Employee::count(),

                'departments' => Department::count(),

                'present_today' => Attendance::whereDate(
                    'attendance_date',
                    $today
                )->whereIn('status', ['Present', 'Late'])->count(),

                'on_leave' => Attendance::whereDate(
                    'attendance_date',
                    $today
                )->where('status', 'Leave')->count(),
            ],
        ]);
    }
}
