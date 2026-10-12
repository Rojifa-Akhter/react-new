<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Models\Department;
use App\Services\DepartmentService;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
public function __construct(
        protected DepartmentService $departmentService
    ) {}

    public function index(Request $request)
    {
        $departments = $this->departmentService->getAll(
            $request->query('search'),
            max(1, min((int) $request->query('per_page', 10), 100))
        );

        return response()->json([
            'success' => true,
            'data' => $departments,
        ]);
    }

    public function store(StoreDepartmentRequest $request)
    {
        $department = $this->departmentService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Department created successfully.',
            'data' => $department,
        ], 201);
    }

    public function show(Department $department)
    {
        return response()->json([
            'success' => true,
            'data' => $this->departmentService->find($department),
        ]);
    }

    public function update(
        UpdateDepartmentRequest $request,
        Department $department
    ) {
        $department = $this->departmentService->update(
            $department,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Department updated successfully.',
            'data' => $department,
        ]);
    }

    public function destroy(Department $department)
    {
        $this->departmentService->delete($department);

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully.',
        ]);
    }
}
