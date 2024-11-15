<?php

test('User can update cart item quantity', function() {
    $user = create_user();
    $item = add_items_to_cart($user, 2);
    $this->actingAs($user);
    $response = $this->post(route('cart.update', ['cart_id' => $item->id, 'quantity' => 3]));
    $newItem = $user->cart()->find($item->id);
    $response->assertSessionHas('success', 'Cart item updated successfully.');
    expect($newItem->quantity)->toEqual(3);
});

test('User cannot update cart item quantity if quantity is less than 1', function() {
    $user = create_user();
    $item = add_items_to_cart($user, 2);
    $this->actingAs($user);
    $response = $this->post(route('cart.update', ['cart_id' => $item->id, 'quantity' => 0]));
    $newItem = $user->cart()->find($item->id);
    $response->assertSessionHasErrors(['quantity']);
    expect($newItem->quantity)->toEqual($item->quantity);

});

test('User cannot update cart quantity if quantity is more than product quantity', function() {
    $user = create_user();
    $item = add_items_to_cart($user, 2);
    $this->actingAs($user);
    $response = $this->post(route('cart.update', ['cart_id' => $item->id, 'quantity' => 999]));
    $newItem = $user->cart()->find($item->id);
    $response->assertSessionHasErrors(['error' => 'Quantity must be less than or equal to product quantity.']);
    expect($newItem->quantity)->toEqual($item->quantity);
});                                                                          

test('User cannot update cart item if product is no longer available', function() {
    $user = create_user();
    $item = add_items_to_cart($user, 2);
    $product = $item->product;
    $product->is_available = false;
    $product->save();
    $this->actingAs($user);
    $response = $this->post(route('cart.update', ['cart_id' => $item->id, 'quantity' => 3]));
    $newItem = $user->cart()->find($item->id);
    $response->assertSessionHasErrors(['error' => 'Product is not available.']);
    expect($newItem->quantity)->toEqual($item->quantity);
});

test('User cannot update cart item quantity if item not in cart', function() {
    $user1 = create_user();
    $user2 = create_user();
    // dd($user2);
    $item = add_items_to_cart($user1, 2);
    $this->actingAs($user2);
    $response = $this->post(route('cart.update', ['cart_id' => $item->id, 'quantity' => 3]));
    $newItem = $user1->cart()->find($item->id);
    // dd($response);
    expect($newItem->quantity)->toEqual(2);
    $response->assertSessionHasErrors(['error' => 'Item not found in User cart.']);
});