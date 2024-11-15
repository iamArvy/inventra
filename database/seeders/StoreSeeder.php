<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $user = User::where('email', 'store@emporium.com')->first();
        Store::factory(1)->create(['owner_id' => $user->id]);
        $user->assignRole('store');
    }
}
