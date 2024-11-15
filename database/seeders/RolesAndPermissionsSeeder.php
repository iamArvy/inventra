<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        Permission::create(['name' => 'create products']);
        Permission::create(['name' => 'edit products']);

        // Create roles and assign existing permissions

        $role = Role::create(['name' => 'store']);
        $role->givePermissionTo(['edit products', 'create products']);
    }
}

