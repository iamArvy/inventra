<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

Route::group([
    // 'middleware'=> ['role:store', 'auth'],
    'middleware'=> ['role:store', 'auth'],
    'as'=>'store.',
    'prefix'=>'store',
    'namespace'=> App\Http\Controllers\Store::class
], function () {
    Route::get('/', 'StoreController@index')->name('index');
    Route::get('/dashboard', 'StoreController@dashboard')->name('dashboard');
    Route::get('/products', 'StoreController@products')->name('products');
    Route::get('/orders', 'StoreController@orders')->name('orders');
    Route::get('/customers', 'StoreController@customers')->name('customers');
    Route::get('/settings', 'StoreController@settings')->name('settings');
    Route::get('/statistics', 'StoreController@statistics')->name('statistics');
    Route::group([
        'as'=>'product.',
        'prefix'=>'product',
    ],function(){
        Route::post('/product/create', 'ProductController@create')->name('create');
        Route::get('/product/{product}', 'ProductController@show')->name('show');
    });
    // Route::get('/product/create', 'ProductController@create')->name('product.create');
    // Route::get('/product/{id}', 'ProductController@show')->name('product.show');

});