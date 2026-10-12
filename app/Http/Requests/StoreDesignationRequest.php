<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDesignationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:designations,name'],
            'code' => ['required', 'string', 'max:50', 'unique:designations,code'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
        ];
    }
}
