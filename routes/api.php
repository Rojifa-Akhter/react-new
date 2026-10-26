<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DesignationController;
use App\Http\Controllers\Api\EmployeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
});
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('attendance/today', [
        AttendanceController::class,
        'today',
    ]);

    Route::post('attendance/check-in', [
        AttendanceController::class,
        'checkIn',
    ]);

    Route::post('attendance/check-out', [
        AttendanceController::class,
        'checkOut',
    ]);
    Route::get('attendance/summary', [
    AttendanceController::class,
    'summary',
]);
});
Route::apiResource('employees', EmployeeController::class);
Route::apiResource('departments', DepartmentController::class);
Route::apiResource('designations', DesignationController::class);
Route::get('attendance/employees', [AttendanceController::class, 'employees']);

Route::apiResource('attendance', AttendanceController::class)
    ->parameters(['attendance' => 'attendance']);
Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware('auth:sanctum');
