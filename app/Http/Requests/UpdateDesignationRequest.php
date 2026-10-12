<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDesignationRequest extends FormRequest
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
        $designation = $this->route('designation');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('designations', 'name')->ignore($designation),
            ],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('designations', 'code')->ignore($designation),
            ],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
        ];
    }
}
