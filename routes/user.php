<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

Route::group([
    'namespace'=> App\Http\Controllers\Emporium::class
], function () {
    Route::get('/', 'EmporiumController@index')->name('home');
    Route::get('/products', 'EmporiumController@categories')->name('categories');
    Route::get('/product/{product}', 'ProductController@show')->name('product.show');
    // Route::get('/profile', 'EmporiumController@about')->name('about');
    // Route::get('/contact', 'EmporiumController@contact')->name('contact');
    Route::get('/search', 'SearchController@search')->name('search');
    Route::get('/products/{category}', 'EmporiumController@category')->name('category');
    Route::get('/products', 'EmporiumController@products')->name('products');
    Route::get('/order/{order}', 'EmporiumController@order')->name('order');
    Route::get('/orders', 'EmporiumController@orders')->name('orders');
    Route::get('/stores', 'EmporiumController@stores')->name('stores');
    Route::get('/stores/{store}', 'EmporiumController@store')->name('store');

    Route::group([
        'middleware'=> ['auth:sanctum'],
    ], function () {

        // Cart 

        Route::group([
            'as'=>'cart.',
            'prefix'=>'/cart'
        ], function () {
            Route::get('/', 'CartController@index')->name('index');
            Route::post('/add', 'CartController@add')->name('add');
            Route::post('/remove', 'CartController@remove')->name('remove');
            Route::post('/clear', 'CartController@clear')->name('clear');
            Route::post('/update', 'CartController@update')->name('update');
        });
        
        // Checkout

        Route::group([
            'as'=>'checkout.',
            'prefix'=>'/checkout'
        ], function () {
            Route::get('/', 'CartController@checkout')->name('get');
            Route::post('/', 'OrderController@store')->name('post');
        });

        // Order

        
    });
});

// No Auth Routes
// Route::group([
//     'as'=>'store.',
//     'prefix'=>'/store',
//     'namespace'=> App\Http\Controllers\Store::class
// ], function () {
//     Route::get('/', 'HomeController@index')->name('home');
//     Route::get('/search', 'SearchController@index')->name('search');
//     Route::get('/product/{product}', 'ProductController@index')->name('product.show');
//     Route::get('/categories', 'CategoryController@index')->name('categories');
//     Route::get('/category/{category}', 'CategoryController@show')->name('category.show');
//     Route::get('/contact', 'EmporiumController@contact')->name('contact');
// });

// // User Cart Route

// Route::group([
//     'as'=>'cart.',
//     'prefix'=>'/cart',
//     'namespace'=> App\Http\Controllers\Store::class,
//     'middleware'=> ['auth', config('jetstream.auth_session')]
// ], function () {
//     Route::get('/', 'CartController@index')->name('index');
//     Route::post('/add', 'CartController@add')->name('add');
//     Route::post('/remove', 'CartController@remove')->name('remove');
//     Route::get('/clear', 'CartController@clear')->name('clear');
//     Route::post('/edit', 'CartController@edit')->name('edit');
// });

// // Checkout

// Route::group([
//     'as'=>'checkout.',
//     'prefix'=>'/checkout',
//     'namespace'=> App\Http\Controllers\Store::class,
//     'middleware'=> ['auth', config('jetstream.auth_session')]
// ], function () {
//     Route::get('/checkout', 'CartController@checkout')->name('get');
//     Route::post('/checkout', 'OrderController@checkout')->name('post');
// });

// // Order

// Route::group([
//     'as'=>'order.',
//     'prefix'=>'/order',
//     'namespace'=> App\Http\Controllers\Store::class,
//     'middleware'=> ['auth', config('jetstream.auth_session')]
// ], function () {
//     Route::get('/', 'OrderController@index')->name('index');
//     Route::get('/order/{order}', 'OrderController@index')->name('product.show');
// });

