<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    protected $fillable = ['quantity'];
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

    public function total()
    {
        return $this->quantity * $this->variant->price;
    }

    public function isEmpty()
    {
        return $this->quantity == 0;
    }

}
