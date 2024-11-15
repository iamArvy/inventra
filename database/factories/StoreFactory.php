<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Store>
 */
class StoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $personalData = [
            'name' => 'Emporium',
            'description' => 'I dont know yet',
            'address' => '3, Oke Street, PZ Estate',
            'city' => 'Ogijo',
            'state' => 'Ogun',
            'country' => 'Nigeria',
            'phone' => '08109229601',
            'email' => 'store@emporium.com',
            'owner_id' => 1
        ];
        
        return [
            'name' => 'Demo Store' . fake()->randomNumber(5),
            'description' => fake()->text(),
            'address' => fake()->address(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'country' => fake()->country(),
            'phone' => '12345678901',
            'email' => fake()->unique()->safeEmail(),
            'owner_id' => \App\Models\User::factory()->create()->id,
        ];
    }
}
