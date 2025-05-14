<?php

it('redirects to log in page', function () {
    // $routes = [{'req'=>'get', 'route'=>'cart.index'}, ('post', 'product.add.cart')];
    $routes = [
        ['cart.index'],
        ['product.add.cart', 'post'],
        // ['cart.checkout']
    ];
    foreach ($routes as $route) {
        $routeName = $route[0];
        $method = $route[1] ?? 'get';
        $response = $this->{$method}(route($routeName));
        $response->assertRedirect('/login');
        $response->assertStatus(302);
    }
});