<?php

namespace App\Services;

use App\Models\Payroll;
use Illuminate\Support\Facades\DB;
use Nette\Schema\ValidationException;

class PayrollService
{
    public function getPayrolls(array $filters = [])
    {
        $query = Payroll::with('employee')->latest();

        if (!empty($filters['salary_month'])) {
            $query->where(
                'salary_month',
                $filters['salary_month']
            );
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['employee_id'])) {
            $query->where(
                'employee_id',
                $filters['employee_id']
            );
        }

        return $query->paginate(10);
    }

    public function createPayroll(array $data): Payroll
    {
        $basicSalary = (float) $data['basic_salary'];
        $allowances = (float) ($data['allowances'] ?? 0);
        $deductions = (float) ($data['deductions'] ?? 0);

        if ($deductions > $basicSalary + $allowances) {
            throw ValidationException::withMessages([
                'deductions' => 'Deductions cannot exceed gross salary.',
            ]);
        }

        $netSalary = round(
            $basicSalary + $allowances - $deductions,
            2
        );

        return Payroll::create([
            'employee_id' => $data['employee_id'],
            'salary_month' => $data['salary_month'],
            'basic_salary' => $basicSalary,
            'allowances' => $allowances,
            'deductions' => $deductions,
            'net_salary' => $netSalary,
            'status' => 'Pending',
            'paid_at' => null,
            'remarks' => $data['remarks'] ?? null,
        ]);
    }

    public function updateStatus(
        Payroll $payroll,
        string $status
    ): Payroll {
        return DB::transaction(function () use ($payroll, $status) {
            $lockedPayroll = Payroll::whereKey($payroll->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedPayroll->status === 'Paid' && $status === 'Pending') {
                throw ValidationException::withMessages([
                    'status' => 'A paid payroll cannot be changed back to Pending.',
                ]);
            }

            $lockedPayroll->update([
                'status' => $status,
                'paid_at' => $status === 'Paid'
                    ? ($lockedPayroll->paid_at ?? now()->toDateString())
                    : null,
            ]);

            return $lockedPayroll->fresh()->load('employee');
        });
    }

    public function deletePayroll(Payroll $payroll): void
    {
        if ($payroll->status === 'Paid') {
            throw ValidationException::withMessages([
                'payroll' => 'Paid payroll records cannot be deleted.',
            ]);
        }

        $payroll->delete();
    }
}
