<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePayrollStatusRequest extends FormRequest
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
            'status' => [
                'required',
                Rule::in(['Pending', 'Paid']),
            ],
        ];
    }
}
