<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allow if user is Admin or HR, OR if the request is not authenticated via Sanctum (e.g., standard public API resource)
        $user = $this->user();
        if (!$user) {
            return true;
        }

        return in_array(
            $user->role,
            ['Admin', 'HR'],
            true
        );
    }

    public function rules(): array
    {
        $employee = $this->route('employee');

        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('employees', 'email')->ignore($employee?->id),
            ],

            'phone' => ['nullable', 'string', 'max:30'],
            'department' => ['nullable', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'salary' => ['required', 'numeric', 'min:0'],
            'joining_date' => ['nullable', 'date'],
            'status' => ['required', 'string', 'in:Active,Inactive'],
        ];
    }
}
