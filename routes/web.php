<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// Route::get('/', [ App\Http\Controllers\Emporium\EmporiumController::class, 'index' ])->('home');
// Route::get('/', function(){

// })->name('home');

require __DIR__.'/user.php';
require __DIR__.'/store.php';
require __DIR__.'/admin.php';
// Store Routes



// Route::middleware([
//     'auth:sanctum',
//     config('jetstream.auth_session'),
//     'verified',
// ])->group(function () {
//     Route::get('/dashboard', function () {
//         return Inertia::render('Dashboard');
//     })->name('dashboard');
// });
