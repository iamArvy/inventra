<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;
    protected $fillable = [
        'address',
        'type',
        'receipient_name',
        'receipient_number',
        'shipping_date',
        'delivery_date',
        'status'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
