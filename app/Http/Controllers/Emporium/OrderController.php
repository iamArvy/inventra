<?php

namespace App\Http\Controllers\Emporium;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\OrderService;
use App\Http\Requests\OrderRequest;

class OrderController extends Controller
{
    //
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        // $this->middleware('auth');
        $this->orderService = $orderService;
    }

    public function index()
    {
        $orders = $this->user()->orders;
        return $this->render('Emporium/Orders', $orders);
    }

    public function store(OrderRequest $request)
    {
        $cartService = app(\App\Services\CartService::class);
        $validated = $request->validated();
        $user = $this->user();
        try{
            $cart = $cartService->getCartItems($this->user());
            // $validated['order_number'] = $orderNumber;
            // dd($cart['total']);
            $validated['total_price'] = $cart['total'];
            // $validated['quantity'] = $cart['quantity'];
            $order = $this->orderService->create($user, $validated);
            // dd($cart['items']);
            $this->orderService->appendItems($order, $cart['items']);
            $items = $order->items;
            return back()->with('success', 'Order Successful');
            if($order){
                $order_number = $this->orderService->createOrderNumber();
                $items = $this->orderService->createOrderItems($cart->items, $order);
                $payment = $this->orderService->makePayment($validated[]);
                return redirect()->back()->with('sucess', 'Order Successful, Item is on the way.');
            }
        }catch(Exception $e){

        }
        

    }

    public function show($id)
    {
        $order = $this->user()->orders()->findOrFail($id);
        return $this->render('Emporium/Orders/Show', $order);
    }

    public function edit($id)
    {
        $order = $this->user()->orders()->findOrFail($id);
        return $this->render('Emporium/Orders/Edit', $order);
    }

    public function update(Request $request, $id)
    {
        $order = $this->user()->orders()->findOrFail($id);
        $order->update([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'price' => $request->get('price'),
        ]);

        return redirect()->route('emporium.orders.show', $order->id);
    }

}
