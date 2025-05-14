<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


abstract class Controller
{
    //
    // public function __construct()
    // {
    //     $this->middleware('auth:sanctum');
    // }

    //
    public function user()
    {
        return Auth::user();
    }

    //
    public function render($component, $props = [])
    {
        return Inertia::render($component, $props);
    }
}
