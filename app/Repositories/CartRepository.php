<?php
namespace App\Repositories;

use App\Models\Cart;

class CartRepository
{
    public function all($user)
    {
        return $user->cart()->with('product')->get();
    }

    public function find($id, $user)
    {
        return $user->cart()->find($id);
    }


    public function changeQuantity($id)
    {
        $item = $this->get($id);
        if($amount > 0){
            $item->product()->reduceQuantity(abs($amount));
            $item->increaseQuantity(abs($amount));
        }else{
            $cart->reduceQuantity($amount);
        }
    }

    public function delete($item)
    {
        $item->product()->increaseQuantity($item->quantity);
        return $item->delete();
    }
}
