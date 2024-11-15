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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->text('address');
            $table->enum('type', ['door', 'pickup']);
            $table->string('receipient_name');
            $table->string('receipient_number');
            $table->dateTime('shipping_date')->nullable();
            $table->dateTime('delivery_date')->nullable();
            $table->timestamps();
        });

        Schema::create('order_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->enum('method', ['card', 'fragments']);
            $table->enum('status', ['pending', 'fail', 'success'])->default('pending');
            $table->timestamps();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('total_price');
            $table->dropColumn('delivery_address');
            $table->dropColumn('delivery_type');
            $table->dropColumn('receipient_name');
            $table->dropColumn('receipient_number');
            $table->dropColumn('payment_method');
            $table->dropColumn('payment_status');
            $table->dropColumn('shipping_date');
            $table->dropColumn('delivery_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('total_price', 10, 2);
            $table->text('delivery_address');
            $table->enum('delivery_type', ['door', 'pickup']);
            $table->string('receipient_name');
            $table->string('receipient_number');
            $table->enum('payment_method', ['card', 'fragments']);
            $table->enum('payment_status', ['pending', 'fail', 'success'])->default('pending');
            $table->dateTime('shipping_date')->nullable();
            $table->dateTime('delivery_date')->nullable();
        });

        Schema::dropIfExists('deliveries');
        Schema::dropIfExists('order_payments');
    }
};
