<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Services\EmployeeService;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function __construct(
        protected EmployeeService $employeeService
    ) {}

    public function index()
    {
        $employees = $this->employeeService->getAll(
            request('search'),
            (int) request('per_page', 10)
        );

        return response()->json([
            'success' => true,
            'data' => $employees,
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $employee = $this->employeeService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully.',
            'data' => $employee,
        ], 201);
    }

    public function show(Employee $employee)
    {
        $employee = $this->employeeService->find($employee);

        return response()->json([
            'success' => true,
            'data' => $employee,
        ]);
    }

    public function update(
        UpdateEmployeeRequest $request,
        Employee $employee
    ) {
        $employee = $this->employeeService->update(
            $employee,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully.',
            'data' => $employee,
        ]);
    }

    public function destroy(Employee $employee)
    {
        $this->employeeService->delete($employee);

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully.',
        ]);
    }
}
