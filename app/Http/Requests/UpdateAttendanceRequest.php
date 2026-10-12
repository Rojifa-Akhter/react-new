<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAttendanceRequest extends FormRequest
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
        $attendance = $this->route('attendance');
        $attendanceId = is_object($attendance)
            ? $attendance->id
            : $attendance;

        return [
            'employee_id' => [
                'required',
                'integer',
                Rule::exists('employees', 'id')->whereNull('deleted_at'),
            ],

            'attendance_date' => [
                'required',
                'date_format:Y-m-d',
                Rule::unique('attendances', 'attendance_date')
                    ->where(fn($query) => $query
                        ->where('employee_id', $this->input('employee_id')))
                    ->ignore($attendanceId),
            ],

            'check_in' => ['nullable', 'date_format:H:i'],
            'check_out' => [
                'nullable',
                'date_format:H:i',
                'after_or_equal:check_in',
            ],

            'status' => [
                'required',
                Rule::in(['Present', 'Absent', 'Late', 'Half Day', 'Leave']),
            ],

            'notes' => ['nullable', 'string'],
        ];
    }
}
