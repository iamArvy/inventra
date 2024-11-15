<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    protected $fillable = ['product_id', 'user_id', 'quantity'];
    protected $table = 'cartitems';
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getTotalPriceAttribute()
    {
        return $this->quantity * $this->product->price;
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

    public function variant()
    {
        return Variant::findorfail($this->variant_id);
    }

    public function total()
    {
        return $this->quantity * $this->variant->price;
    }

    public function isEmpty()
    {
        return $this->quantity == 0;
    }

}
