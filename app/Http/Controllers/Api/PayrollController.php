<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePayrollRequest;
use App\Http\Requests\UpdatePayrollStatusRequest;
use App\Models\Payroll;
use App\Services\PayrollService;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
     public function __construct(
        private PayrollService $payrollService
    ) {}

    public function index(Request $request)
    {
        abort_unless(
            in_array($request->user()->role, ['Admin', 'HR'], true),
            403,
            'Only Admin or HR can view payroll records.'
        );

        $filters = $request->validate([
            'salary_month' => ['sometimes', 'date_format:Y-m'],
            'status' => ['sometimes', 'in:Pending,Paid'],
            'employee_id' => ['sometimes', 'integer', 'exists:employees,id'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $this->payrollService->getPayrolls($filters),
        ]);
    }

    public function store(StorePayrollRequest $request)
    {
        $payroll = $this->payrollService->createPayroll(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Payroll created successfully.',
            'data' => $payroll->load('employee'),
        ], 201);
    }

    public function show(Request $request, Payroll $payroll)
    {
        abort_unless(
            in_array($request->user()->role, ['Admin', 'HR'], true),
            403,
            'Only Admin or HR can view payroll records.'
        );

        return response()->json([
            'success' => true,
            'data' => $payroll->load('employee'),
        ]);
    }

    public function updateStatus(
        UpdatePayrollStatusRequest $request,
        Payroll $payroll
    ) {
        $updatedPayroll = $this->payrollService->updateStatus(
            $payroll,
            $request->validated()['status']
        );

        return response()->json([
            'success' => true,
            'message' => 'Payroll status updated successfully.',
            'data' => $updatedPayroll,
        ]);
    }

    public function destroy(Request $request, Payroll $payroll)
    {
        abort_unless(
            in_array($request->user()->role, ['Admin', 'HR'], true),
            403,
            'Only Admin or HR can delete payroll records.'
        );

        $this->payrollService->deletePayroll($payroll);

        return response()->json([
            'success' => true,
            'message' => 'Payroll deleted successfully.',
        ]);
    }
}
