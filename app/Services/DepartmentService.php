<?php

namespace App\Services;

use App\Models\Department;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DepartmentService
{
public function getAll(
        ?string $search = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        return Department::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Department
    {
        return Department::create($data);
    }

    public function find(Department $department): Department
    {
        return $department;
    }

    public function update(
        Department $department,
        array $data
    ): Department {
        $department->update($data);

        return $department->fresh();
    }

    public function delete(Department $department): bool
    {
        return (bool) $department->delete();
    }
}
