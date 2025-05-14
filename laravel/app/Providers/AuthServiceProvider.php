<?php

namespace App\Providers;

// use Illuminate\Support\ServiceProvider;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Cart;
use App\Policies\CartPolicy;
use App\Models\Watchlist;
use App\Policies\WatchlistPolicy;
use App\Models\Product;
use App\Policies\ProductPolicy;
// use App\Models\Order;
// use App\Policies\OrderPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    protected $policies = [
        Cart::class => CartPolicy::class,
        Watchlist::class => WatchlistPolicy::class,
        Product::class => ProductPolicy::class,
        // Order::class => OrderPolicy::class,
        // Add more policy mappings as needed
        // Model => Policy mappings
    ];
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        //
    }
}
