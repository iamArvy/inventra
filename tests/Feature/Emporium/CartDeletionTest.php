<?php
use App\Models\User;

test('User can remove item from cart', function(){
    $user = User::factory()->create();
    $item = add_items_to_cart($user);
    $this->actingAs($user);
    $response = $this->post(route('cart.remove'), ['item'=>$item->product_id]);
    $response->assertSessionHas('success', 'Item removed from cart.');
    expect($user->cart()->find($item->product_id))->toBe(null);

});

test('User cannot remove non-existent item from cart', function() {
    $user = User::factory()->create();
    $this->actingAs($user);
    $response = $this->post(route('cart.remove'), ['item' => 9999]); // Assuming 9999 doesn't exist
    $response->assertSessionHasErrors(['error' => 'Item not found in User cart.']);
});

test('User can clear their cart', function(){
    $user = User::factory()->create();
    $item1 = add_items_to_cart($user);
    $item2 = add_items_to_cart($user);
    $this->actingAs($user);
    $response = $this->post(route('cart.clear'));
    $response->assertSessionHas('success', 'Cart cleared successfully.');
    expect($user->cart()->find($item2->product_id))->toBe(null);
    expect($user->cart()->find($item1->product_id))->toBe(null);
    expect($user->cart()->count())->toBe(0);

});

test('Display Error if User Cart is Empty', function() {
    $user = User::factory()->create();
    $this->actingAs($user);
    $response = $this->post(route('cart.clear'));
    $response->assertSessionHasErrors(['error' => 'Cart is empty.']);
});