<?php
namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    public function create($store, $data)
    {
        $store->products->create($data);
    }
    
    public function all(): array
    {
        return Product::all();
    }

    public function find(string $id)
    {
        return Product::find($id);
    }

    public function findProductWithRelationships(string $id, array $relationships)
    {
        return Product::find($id)->with($relationships)->first();
    }

    public function save(Product $product): void
    {
        $product->save();
    }

    public function update($id, array $data)
    {
        $product = $this->find($id);
        $product->update($data);
        return $product;
    }

    public function delete($id)
    {
        $product = $this->find($id);
        return $product->delete();
    }

    public function getProductsByIds(array $ids)
    {
        return Product::whereIn('_id', $ids)->get()->keyBy('_id');
    }
}
