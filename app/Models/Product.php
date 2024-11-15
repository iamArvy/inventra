<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use App\Models\Store;

class Product extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'category_id', 'images', 'price', 'quantity', 'store_id'];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }
    
    public function getImagesAttribute($value)
    {
        return json_decode($value, true); // Decode JSON string to an associative array
    }

    // Mutator for the images attribute
    public function setImagesAttribute($value)
    {
        $this->attributes['images'] = json_encode($value); // Encode array to JSON string
    }
    
    public function store()
    {
        return $this->belongsTo(Store::class);

    }

    public function category()
    {
        return Category::find($this->store_id);
    }

    // public function variants()
    // {
    //     return $this->hasMany(Variant::class);
    // }

    public function reduceQuantity(int $amount)
    {
        if($this->quantity < $amount){
            throw new \ProductException('Not enough stock available');
        }

        $this->quantity -= $amount;
        $this->save();
    }

    public function increaseQuantity(int $amount)
    {
        $this->quantity += $amount;
        $this->save();
    }

    public function inCart($user): boolval
    {
        return $user->cart()->where('product_id', $this->id)->count() > 0;
    }
}
