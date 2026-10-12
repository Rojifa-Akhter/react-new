<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDesignationRequest;
use App\Http\Requests\UpdateDesignationRequest;
use App\Models\Designation;
use App\Services\DesignationService;
use Illuminate\Http\Request;

class DesignationController extends Controller
{
    public function __construct(
        protected DesignationService $designationService
    ) {}

    public function index(Request $request)
    {
        $designations = $this->designationService->getAll(
            $request->query('search'),
            max(1, min((int) $request->query('per_page', 10), 100))
        );

        return response()->json([
            'success' => true,
            'data' => $designations,
        ]);
    }

    public function store(StoreDesignationRequest $request)
    {
        $designation = $this->designationService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Designation created successfully.',
            'data' => $designation,
        ], 201);
    }

    public function show(Designation $designation)
    {
        return response()->json([
            'success' => true,
            'data' => $this->designationService->find($designation),
        ]);
    }

    public function update(
        UpdateDesignationRequest $request,
        Designation $designation
    ) {
        $designation = $this->designationService->update(
            $designation,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Designation updated successfully.',
            'data' => $designation,
        ]);
    }

    public function destroy(Designation $designation)
    {
        $this->designationService->delete($designation);

        return response()->json([
            'success' => true,
            'message' => 'Designation deleted successfully.',
        ]);
    }
}
