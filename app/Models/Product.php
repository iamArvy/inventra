<?php

namespace App\Models;

use App\Services\StockService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'images',
        'price',
        'additional_information',
        'is_available'
    ];

    // Slug generation
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orders()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function cart()
    {
        return $this->belongsToMany(User::class, 'cartitems')
        ->withPivot('quantity') // Attach the quantity column from the pivot table
        ->withTimestamps();
    }
    // Scopes for reusable queries
    // public function scopeInCart($query, $user)
    // {
    //     return $query->whereHas('cart', function ($query) use ($user) {
    //         $query->where('user_id', $user->id);
    //     });
    // }

    // public function scopeInWishlist($query, $user)
    // {
    //     return $query->whereHas('wishlist', function ($query) use ($user) {
    //         $query->where('user_id', $user->id);
    //     });
    // }

    // Custom attributes (Accessors)
    public function getRatingWithReviewsCountAttribute()
    {
        $rating = $this->reviews()->avg('rating');
        $reviewsCount = $this->reviews()->count();
        return ['rating' => $rating, 'reviews_count' => $reviewsCount];
    }

    // Mutators for Images Attribute (JSON to array and vice versa)
    public function getImagesAttribute($value)
    {
        return json_decode($value, true); // Decode JSON string to array
    }

    public function setImagesAttribute($value)
    {
        $this->attributes['images'] = json_encode($value); // Encode array to JSON string
    }
    // Helper method to get sales quantity
    public function getSalesAttribute()
    {
        return $this->orders()->sum('quantity');
    }

    // Orders count (using relation)
    public function getOrdersCountAttribute()
    {
        return $this->orders()->count();
    }

}
