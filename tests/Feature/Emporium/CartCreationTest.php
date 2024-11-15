<?php
test('User can add item to cart', function() {
    $user = create_user();
    $product = create_product();
    $this->actingAs($user);
    $response = $this->post(route('product.add.cart', ['product_id' => $product->id, 'quantity' => 2]));
    // dd($response);
    $item = $user->cart()->where('product_id', $product->id)->first();
    expect($item->product->id)->toEqual($product->id);
    expect($item->quantity)->toEqual(2);
    $cartItems = $user->cart()->with('product')->get();
    expect($cartItems->first()->id)->toEqual($item->id);
    $response->assertSessionHas('success', 'Product added to cart successfully');
});

test('user cannot add item to cart is product not found', function(){
    $user = create_user();
    $this->actingAs($user);
    $response = $this->post(route('product.add.cart', ['product_id' => 9999, 'quantity' => 2]));
    $item = $user->cart()->where('product_id', 9999)->first();
    expect($item)->toBeNull();
    $cartItems = $user->cart;
    expect($cartItems->count())->toBe(0);
    $response->assertSessionHasErrors(['error' => 'Product not found']);
});

test('User cannot add item to cart if quantity is less than 1', function() {
    $user = create_user();
    $product = create_product();
    $this->actingAs($user);
    $response = $this->post(route('product.add.cart', ['product_id' => $product->id, 'quantity' => 0]));
    $item = $user->cart()->where('product_id', $product->id)->first();
    expect($item)->toBeNull();
    $response->assertSessionHasErrors(['quantity']);
});

test('User cannot add item to cart if quantity is more than product quantity', function() {
    $user = create_user();
    $product = create_product();
    $this->actingAs($user);
    $response = $this->post(route('product.add.cart', ['product_id' => $product->id, 'quantity' => 9999]));
    $item = $user->cart()->where('product_id', $product->id)->first();
    expect($item)->toBeNull();
    $response->assertSessionHasErrors(['error' => 'Quantity must be less than or equal to product quantity.']);
});                                                                          

test('User cannot add item to cart if product is no longer available', function() {
    $user = create_user();
    $product = create_product();
    $product->is_available = false;
    $product->save();
    $this->actingAs($user);
    $response = $this->post(route('product.add.cart', ['product_id' => $product->id, 'quantity' => 2]));
    $item = $user->cart()->where('product_id', $product->id)->first();
    expect($item)->toBeNull();
    $response->assertSessionHasErrors(['error' => 'Product is not available.']);
});