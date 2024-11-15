<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;
    protected $table = 'variants';
    
    protected $primaryKey = 'id';
    protected $fillable = [
        'product_id',
        'variant_name',
        'variant_value',
    ];
}
