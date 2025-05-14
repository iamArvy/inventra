<?php
namespace App\Repositories;

use App\Models\Order;

class OrderRepository
{
    public function all()
    {
        return Order::all();
    }

    public function find($id)
    {
        return Order::findorfail($id);
    }

    public function create($data)
    {
        Order::create($data);
    }
}