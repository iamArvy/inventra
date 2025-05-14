<?php
namespace App\Repositories;

// use App\Models\Cart;
// use App\Models\Product;
// use Illuminate\Support\Facades\Auth;
class CartRepository
{
    public function find($id, $user)
    {
        return $user->cart()->wherePivot('product_id', $id)->first();
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
}
