<?php

namespace App\Http\Controllers\Emporium;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmporiumController extends Controller
{
    //
    public function index()
    {
        # code...
        // dd(Auth::user());
        // dd(Auth::check());
        // dd(Auth::id());
        // $categories = Category::all();
        $products = Product::all();
        if (Auth::check()) {
            $user = Auth::user();
            $cartNumber = $user->cart()->count();
        }
        $data = [
            // 'categories' => $categories,
            'products' => $products,
            'cartNumber' => $cartNumber ?? null
        ];
        return $this->render('Emporium/Home', $data);
    }
    public function categories()
    {
        $categories = Category::all();
        return $this->render('Emporium/Categories', [
            'categories' => $categories
        ]);
    }
    public function products()
    {
        $products = Product::all();
        return $this->render('Emporium/Products', [
            'products' => $products
        ]);
    }
    public function stores()
    {
        $stores = Store::all();
        return $this->render('Emporium/Stores', [
            'stores' => $stores
        ]);
    }
}
