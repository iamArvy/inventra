<?php

test('User can update cart item quantity', function() {
    $user = create_user();
    $item = add_items_to_cart($user->id);
    $this->actingAs($user);
    $response = $this->post(route('cart.update', ['item' => $item->product_id, 'quantity' => 4]));
    $newItem = $user->cart()->wherePivot('product_id', $item->product_id)->first();
    $response->assertSessionHas('success', 'Cart item updated successfully.');
    expect($newItem->pivot->quantity)->toEqual(4);
});

test('User cannot update cart item quantity if quantity is less than 1', function() {
    $user = create_user();
    $item = add_items_to_cart($user->id);
    $this->actingAs($user);
    $response = $this->post(route('cart.update', ['item' => $item->id, 'quantity' => 0]));
    $newItem = $user->cart()->wherePivot('product_id', $item->product_id)->first();
    $response->assertSessionHasErrors(['quantity']);
    expect($newItem->pivot->quantity)->toEqual($item->quantity);

});

test('User cannot update cart quantity if quantity is more than product quantity', function() {
    $user = create_user();
    $item = add_items_to_cart($user->id);
    $this->actingAs($user);
    $response = $this->post(route('cart.update', ['item' => $item->id, 'quantity' => 999]));
    $newItem = $user->cart()->wherePivot('product_id', $item->product_id)->first();
    $response->assertSessionHasErrors(['error' => 'Quantity must be less than or equal to product quantity.']);
    expect($newItem->pivot->quantity)->toEqual($item->quantity);
});                                                                          

test('User cannot update cart item if product is no longer available', function() {
    $user = create_user();
    $item = add_items_to_cart($user->id);
    $product = $item->product;
    $product->is_available = false;
    $product->save();
    $this->actingAs($user);
    $response = $this->post(route('cart.update', ['item' => $item->id, 'quantity' => 4]));
    $newItem = $user->cart()->wherePivot('product_id', $item->product_id)->first();
    $response->assertSessionHasErrors(['error' => 'Product is not available.']);
    expect($newItem->pivot->quantity)->toEqual($item->quantity);
});

test('User cannot update cart item quantity if item not in cart', function() {
    $user1 = create_user();
    $user2 = create_user();
    $item = add_items_to_cart($user1->id);
    $this->actingAs($user2);
    $response = $this->post(route('cart.update', ['item' => $item->id, 'quantity' => 4]));
    $newItem = $user1->cart()->wherePivot('product_id', $item->product_id)->first();
    expect($newItem->pivot->quantity)->toEqual($item->quantity);
    $response->assertSessionHasErrors(['error' => 'Item not found in User cart.']);
});