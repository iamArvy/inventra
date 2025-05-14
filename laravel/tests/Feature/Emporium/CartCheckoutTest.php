<?php
use App\Models\User;
use App\Models\Cart;
use Inertia\Testing\AssertableInertia as Assert;

$route = 'checkout.get';

test('Checkout Page can be rendered', function () {
    $user = User::factory()->create();
    $item = add_items_to_cart($user->id);
    $this->actingAs($user);
    $response = $this->get(route('checkout.get'));
    $response->assertInertia(function (Assert $page) {
        $page->component('Emporium/Checkout');
    });
    $response->assertStatus(200);
});

test('User can see cart details', function(){
    $user = User::factory()->create();
    $item = add_items_to_cart($user->id);
    $this->actingAs($user);
    $cartItems = $user->cart()->with('product')->get();
    $response = $this->get(route('checkout.get'));
    expect($cartItems[0]->id)->toEqual($item->id);
    $response->assertInertia(function (Assert $page) use ($cartItems)  {
        $page->component('Emporium/Checkout')
            ->has('items', count($cartItems))
            ->where('items', $cartItems);
    });
});

test('Display Error if User Cart is Empty', function() {
    $user = User::factory()->create();
    $this->actingAs($user);
    $response = $this->get(route('checkout.get'));
    $response->assertSessionHasErrors(['error' => 'Cart is empty.']);
});