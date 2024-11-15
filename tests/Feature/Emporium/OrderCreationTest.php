<?php

$route = 'checkout.post';

test('User can place Order', function () {
    $user = create_user();
    $cart = add_items_to_cart($user, 2);
    $this->actingAs($user);
    $data = [
        'receipient_name' => 'Test',
        'receipient_number' => '08109229601',
        'delivery_type' => 'door',
        'delivery_address' => 'test',
        'payment_method' => 'card',
    ];
    $response = $this->post(route('checkout.post'), $data);
    dd($response);
    $response->assertStatus(200);
});
