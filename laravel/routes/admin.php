<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

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