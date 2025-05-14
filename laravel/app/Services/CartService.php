<?php

namespace App\Services;

use App\Services\Service;
use App\Repositories\CartRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\CustomException;

class CartService extends Service
{
    protected $cartRepo;
    protected $productRepo;
    protected $orderRepo;

    public function __construct(CartRepository $cartRepo)
    {
        $this->cartRepo = $cartRepo;
        $this->productRepo = app('App\Repositories\ProductRepository');
        $this->orderRepo = app('App\Repositories\OrderRepository');
    }

    public function getCartItems($user)
    {
        // $items = $this->cartRepo->all($user);
        $items = $user->cart()->get();
        // $items->transform(function ($item) {
        //     $item->product = $item->product->first();
        //     $item->total_price = $item->product->price * $item->quantity;
        //     return $item;
        // });
        // dd($items)
        $data = [
            'items' => $items,
            'total' => $items->sum('price'),
            'quantity' => $items->sum('quantity'),
        ];
        // dd($data);
        return $data;
    }

    public function add($user, $data)
    {
        if(!$user) throw new Exception("Error Processing Request", 1);
        $product = $this->productRepo->find($data['product_id']);
        if(!$product) throw new ModelNotFoundException('Product not found.');
        if($product->stock < $data['quantity']) throw new CustomException('Quantity must be less than or equal to product quantity.');
        if(!$product->is_available) throw new CustomException('Product is not available.');
        $user->cart()->syncWithoutDetaching([
            $product->id => ['quantity' => $data['quantity']] // The product ID and quantity to add to the pivot table
        ]);
    }

    /**
     * Check if the user is the owner of the item.
     *
     * @param User $user
     * @param Integer $id
     * @return Cart $item
     * @throws ModelNotFoundException
     */

    public function get($id, $user)
    {
        $item = $user->cart()->find($id);
        if(!$item) throw new ModelNotFoundException("Item not found in User cart.");
        return $item;  
    }

    public function changeQuantity($user, $id, $quantity)
    {
        $product = $this->get($id, $user);
        if(!$product) throw new ModelNotFoundException('Product not found in Cart.');
        if($product->stock < $quantity) throw new CustomException('Quantity must be less than or equal to product quantity.');
        if(!$product->is_available) throw new CustomException('Product is not available.');
        $user->cart()->updateExistingPivot($id, [
            'quantity' => $quantity
        ]);
    }

    public function remove($user, $id)
    {
        $this->get($id, $user);
        $user->cart()->detach($id);
    }

    public function clear($user)
    {
        if ($user->cart()->count() === 0) throw new ModelNotFoundException("Cart is Empty");
        $user->cart()->detach();
    }

    public function checkout($user)
    {
        $items = $this->cartRepo->all($user);
        if ($items->count() === 0) throw new ModelNotFoundException("Items not found.");
        $data = [
            'items' => $items,
            'total' => $items->sum('total_price'),
            'quantity' => $items->sum('quantity'),
        ];
        return $data;
    }

    public function reduceQuantity(int $amount)
    {
        if($this->quantity < $amount){
            throw new \Exception('Not enough stock available');
        }

        $this->quantity -= $amount;
        $this->save();
    }

    public function increaseQuantity(int $amount)
    {
        $this->quantity += $amount;
        $this->save();
    }

}
