<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in(['Approved', 'Rejected']),
            ],
            'admin_remarks' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }
}
