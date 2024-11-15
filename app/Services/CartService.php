<?php

namespace App\Services;

use App\Services\Service;
use App\Repositories\CartRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\CustomException;

class CartService extends Service
{
    protected $cartRepo;

    public function __construct(CartRepository $cartRepo)
    {
        $this->cartRepo = $cartRepo;
    }

    public function getCartItems($user)
    {
        $items = $this->cartRepo->all($user);
        $data = [
            'items' => $items,
            'total' => $items->sum('total_price'),
            'quantity' => $items->sum('quantity'),
        ];
        return $data;
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
        $item = $this->cartRepo->find($id, $user);
        if(!$item) throw new ModelNotFoundException("Item not found in User cart.");
        return $item;  
    }

    public function changeQuantity($cart, $quantity)
    {
        $product = $cart->product->first();
        // dd($product);
        if(!$product) throw new ModelNotFoundException('Product not found.');
        if($product->quantity < $quantity) throw new CustomException('Quantity must be less than or equal to product quantity.');
        if(!$product->is_available) throw new CustomException('Product is not available.');
        $cart->quantity = $quantity;
        $cart->save();
    }

    public function clear($user)
    {
        $items = $this->cartRepo->all($user);
        if ($items->count() === 0) throw new ModelNotFoundException("Items not found.");
        foreach ($items as $item) {
            $item->delete();
        }
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

}
