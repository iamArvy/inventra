<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Store\StoreController;
use App\Http\Requests\CreateProductRequest;
use App\Services\ProductService;

class ProductController extends StoreController
{
    protected $productService;
    
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }
    
    public function index()
    {
        $products = $this->store->products();
        return $this->render('Store/Dashboard', [
            'title' => 'Dashboard',
            'products'=> $products
        ]);
    }

    public function show(Request $request)
    {
        $id = $request->product;
        try {
            $product = $this->productService->getProduct();
            $data = [
                'title' => 'Product',
                'product'=> $product
            ];
            return $this->render('Emporium/Product', $product);
        } catch (\Exception $e) {
            return redirect()->route('error', ['code' => 404, 'message' => 'Product Not Found']);
        }
        
    }

    public function create(CreateProductRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['images'] = $request->hasFile('images') ? $this->productService->uploadImage($request->hasFile('images')) : null;
            $product = $this->productService->create($this>store, $validated);
            return redirect()->back()->with('success', 'Product added successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    public function createVariants(Request $request, Product $product)
    {
        $validated = $request->validated();
        foreach ($validated['variants'] as $item){
            $variant = $product->variants()->create($item);
        }
        // $variant = $product->variants()->create($validated);

    }
}
