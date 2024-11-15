<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Cart;

class CartPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
   

    }
    public function view(User $user, Cart $cart)
    {
        // return $user->hasRole('admin');
    }

    public function create(User $user, Cart $cart)
    {
        return auth()->check();
    }

    public function update(User $user)
    {
        return $user->id === $cart->user_id;
    }

    public function delete(User $user)
    {
        return $user->id === $cart->user_id;
    }
}
