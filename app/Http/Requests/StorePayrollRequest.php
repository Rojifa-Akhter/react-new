<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePayrollRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array(
            $this->user()?->role,
            ['Admin', 'HR'],
            true
        );
    }

    public function rules(): array
    {
        return [
            'employee_id' => [
                'required',
                'integer',
                'exists:employees,id',
            ],
            'salary_month' => [
                'required',
                'date_format:Y-m',
                Rule::unique('payrolls', 'salary_month')
                    ->where('employee_id', $this->input('employee_id')),
            ],
            'basic_salary' => [
                'required',
                'numeric',
                'min:0',
                'max:9999999999.99',
            ],
            'allowances' => [
                'nullable',
                'numeric',
                'min:0',
                'max:9999999999.99',
            ],
            'deductions' => [
                'nullable',
                'numeric',
                'min:0',
                'max:9999999999.99',
            ],
            'remarks' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }
}
