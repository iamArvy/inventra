<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TestMongoController;
// use App\Http\Controllers\Store;
// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
Route::group([
    'middleware'=> ['role:admin', 'auth'],
    'as'=>'admin.',
    'prefix'=>'admin',
    'namespace'=> App\Http\Controllers\Admin::class
], function () {
    Route::get('/', 'AdminController@index')->name('index');
    Route::get('/dashboard', 'AdminController@dashboard')->name('dashboard');
    Route::get('/stores', 'AdminController@stores')->name('stores');
    Route::get('/orders', 'AdminController@orders')->name('orders');
    Route::get('/customers', 'AdminController@customers')->name('customers');
    Route::get('/settings', 'AdminController@settings')->name('settings');
    Route::get('/statistics', 'AdminController@statistics')->name('statistics');
});

Route::group([
    // 'middleware'=> ['role:customer', 'auth'],
    // 'as'=>'customer.',
    // 'prefix'=>'customer',
    'namespace'=> App\Http\Controllers\Emporium::class
], function () {
    Route::get('/', 'EmporiumController@index')->name('home');
    Route::get('/products', 'EmporiumController@products')->name('products');
    Route::get('/product/{product}', 'ProductController@show')->name('product.show');
    Route::get('/cart', 'EmporiumController@cart')->name('cart');
    Route::get('/profile', 'EmporiumController@about')->name('about');
    Route::get('/contact', 'EmporiumController@contact')->name('contact');
    Route::get('/search', 'EmporiumController@search')->name('search');
    Route::get('/products/{category}', 'EmporiumController@category')->name('category');
    Route::get('/products', 'EmporiumController@products')->name('products');
    Route::get('/order/{order}', 'EmporiumController@order')->name('order');
    Route::get('/orders', 'EmporiumController@orders')->name('orders');
    Route::get('/stores', 'EmporiumController@stores')->name('stores');
    Route::get('/stores/{store}', 'EmporiumController@store')->name('store');
    // Route::get('/dashboard', 'CustomerController@dashboard')->name('dashboard');
    // Route::get('/orders', 'CustomerController@orders')->name('orders');
    // Route::get('/settings', 'CustomerController@settings')->name('settings');
    // Route::get('/statistics', 'CustomerController@statistics')->name('statistics');
});

Route::group([
    'middleware'=> ['auth:sanctum'],
    'namespace'=> App\Http\Controllers\Emporium::class,
    'as'=>'cart.',
    'prefix'=>'/cart'
], function () {
    Route::get('/', 'CartController@index')->name('index');
    Route::post('/add', 'CartController@add')->name('add');
    Route::post('/remove', 'CartController@remove')->name('remove');
    Route::post('/clear', 'CartController@clear')->name('clear');
    // Route::get('/checkout', 'CartController@checkout')->name('checkout');
    Route::post('/update', 'CartController@update')->name('update');
});

Route::group([
    'middleware'=> ['auth:sanctum'],
    'namespace'=> App\Http\Controllers\Emporium::class,
    'as'=>'checkout.',
    'prefix'=>'/checkout'
], function () {
    Route::get('/', 'CartController@checkout')->name('get');
    Route::post('/', 'OrderController@store')->name('post');
});

Route::group([
    'middleware'=> ['auth:sanctum'],
    'namespace'=> App\Http\Controllers\Emporium::class,
    'as'=>'product.add.',
    'prefix'=>'/product/add'
], function () {
    Route::post('/cart', 'ProductController@addtocart')->name('cart');
    Route::post('/wishlist', 'ProductController@addtowishlist')->name('wishlist');
});

Route::get('/test',  [TestMongoController::class, 'store']);
// Route::get('/store/dashboard',  [TestMongoController::class, 'store']);
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
Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});
