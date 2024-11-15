<?php

namespace App\Services;

use App\Repositories\OrderRepository;
class OrderService
{
    protected $orderRepository;

    public function __construct(OrderRepository $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    private function getOrderNumber(){
        $year = date('Y');
        // return 'ORD-' . $year . '-' . str_pad($order->id, 4, '0', STR_PAD_LEFT);
        return $year;
    }

    public function createOrderItems($items, $order){
        foreach($items as $item){
            $data = [
                'product_id' => $item->product->id,
                'product_name' => $item->product->name,
                'price' => $item->product->price,
                'quantity' => $item->quantity,
                'total' => $item->total_price
            ];
            $order->items()->create($data);
        }
    }

    public function appendItems($order, $items)
    {
        foreach ($items as $item)
        {
            $data = [
                'quantity' => $item['quantity'],
                'price' => $item['product']->price,
                'product_id' => $item['product_id']
            ];
            $order->items()->create($data);
        }
    }
    public function create($user, array $validated)
    {
        // $orderNumber = $this->getOrderNumber();
        $order = $user->orders()->create($validated);
        return $order;        
    }

    public function all($user)
    {
        $productRepository = app(ProductRepository::class);
        $cartItems = $user->cart()->get();
        $productIds = $cartItems->pluck('product_id')->toArray();
        $products = $productRepository->getProductsByIds($productIds);
        foreach ($cartItems as $item) {
            $item->product = $products->get($item->product_id);
            $item -> total_price = $item->quantity * $item->product->price;
        }
        return [
            'items' => $cartItems,
            'total' => $cartItems->sum('total_price'),
            'quantity' => $cartItems->sum('quantity'),
        ];  
    }

    public function get($id){

    }

    public function getItems($order){

    }
    
}
