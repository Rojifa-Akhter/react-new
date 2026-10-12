<?php

namespace App\Services;

use App\Models\Designation;
use Illuminate\Pagination\LengthAwarePaginator;

class DesignationService
{
    public function getAll(
        ?string $search = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        return Designation::query()
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

    public function create(array $data): Designation
    {
        return Designation::create($data);
    }

    public function find(Designation $designation): Designation
    {
        return $designation;
    }

    public function update(
        Designation $designation,
        array $data
    ): Designation {
        $designation->update($data);

        return $designation->fresh();
    }

    public function delete(Designation $designation): bool
    {
        return (bool) $designation->delete();
    }
}
