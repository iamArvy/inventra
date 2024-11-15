<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class StoreController extends Controller
{
    protected $store;
    public function __construct()
    {
        if($this->user() && $this->user()->hasRole('store')){
            $this->store = $this->user()->store;
        }else{
            $this->store = null;
            return redirect()->route('home');
        }
    }

    public function index()
    {
        return redirect()->route('store.dashboard');
    }

    public function dashboard()
    {
        // $products = $this->store->products;
        return $this->render('Store/Dashboard');
    }

    public function products()
    {
        // $products = Pr/
        $products = Product::where('store_id', $this->store->id)->get();
        // $products = $this->store->products;
        // dd($products);
        return $this->render('Store/Products',[
            'products' => $products
        ]);
    }

    public function orders()
    {
        // $products = $this->store->products;
        return $this->render('Store/Orders');
    }

    public function statistics()
    {
        // $products = $this->store->products;
        return $this->render('Store/Statistics');
    }
}
