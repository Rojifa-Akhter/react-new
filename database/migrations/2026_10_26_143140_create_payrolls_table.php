<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')
                ->constrained('employees')
                ->cascadeOnDelete();

            // Store the salary month as YYYY-MM
            $table->string('salary_month', 7);

            $table->decimal('basic_salary', 12, 2);
            $table->decimal('allowances', 12, 2)->default(0);
            $table->decimal('deductions', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2);

            $table->enum('status', ['Pending', 'Paid'])
                ->default('Pending');

            $table->date('paid_at')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();

            // One payroll record per employee per month
            $table->unique(
                ['employee_id', 'salary_month'],
                'payroll_employee_month_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
