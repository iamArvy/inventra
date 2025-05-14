<?php

namespace Database\Factories;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $imagesArray = [
            '/assets/demoimg.png',
            '/assets/demoimg.png',
            '/assets/demoimg.png',
        ];
        $additionalInformation = [
            'color' => 'red',
            'size' => 'M',
            'material' => 'cotton'
        ];
        return [
            'name' => 'Demo Product ' . fake()->randomNumber(5),
            'description' => fake()->text(),
            'images' => json_encode($imagesArray),
            'category_id' => \App\Models\Category::factory()->create()->id,
            'store_id' => \App\Models\Store::factory()->create()->id,
            'stock' => fake()->numberBetween(0, 100),
            'price' => fake()->randomFloat(2, 10, 1000),
            'additional_information' => json_encode($additionalInformation),
            'is_available' => fake()->boolean(),
            'slug' => fake()->slug(),
        ];
    }
}
