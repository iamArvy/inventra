<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\CustomException;

class ProductService
{
    protected $productRepo;

    public function __construct(ProductRepository $productRepo)
    {
        $this->productRepo = $productRepo;
    }

    private function getOrderNumber(){
        $year = date('Y');
        // return 'ORD-' . $year . '-' . str_pad($order->id, 4, '0', STR_PAD_LEFT);
        return $year;
    }

    public function getProductWithRelationships(string $id, array $relationships){
        $product = $this->productRepo->findProductWithRelationships($id, $relationships);
        if(!$product){
            throw new ModelNotFoundException('Product Not Found');
        }
        return $product;
    }


    public function uploadImages($images){
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('product-images', 'public');
                $imagePaths[] = 'storage/'.$path;
            }
        }
    }
    public function create($store, $data)
    {
        $this->productRepo->create($store, $data);
    }

    public function reduceStock($product, int $amount)
    {
        if ($product->stock < $amount) {
            throw new CustomException('Not enough stock available');
        }

        $product->stock -= $amount;
        $product->save();
    }

    public function increaseStock($product, int $amount)
    {
        $product->stock += $amount;
        $product->save();
    }
    
}