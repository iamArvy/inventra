<?php

namespace App\Services;

use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;

class Service
{
    public function cartRepo()
    {
        return app(\App\Repositories\CartRepository::class);
    }

    public function productRepo()
    {
        return app(\App\Repositories\ProductRepository::class);
    }
}
