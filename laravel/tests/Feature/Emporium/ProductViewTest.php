<?php
use Inertia\Testing\AssertableInertia as Assert;
use App\Models\Product;

test('Product Page can be rendered', function () {
    $product = create_product();
    $response = $this->get(route('product.show', ['product' => $product->id ]));
    $response->assertStatus(200);
    $response->assertInertia(function (Assert $page) {
        $page->component('Emporium/Product');
    });
});

test('User can see Product', function(){
    $product = create_product();
    $item = Product::find($product->id)->with('store')->first();
    $response = $this->get(route('product.show', ['product' => $product->id ]));
    $response->assertInertia(function (Assert $page) use ($item)  {
        $page->component('Emporium/Product')
            ->has('product')
            ->where('product', $item);
    });
});