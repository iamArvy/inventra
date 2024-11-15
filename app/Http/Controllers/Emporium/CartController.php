<?php

namespace App\Http\Controllers\Emporium;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Requests\CreateCartRequest;
use App\Services\CartService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\Access\AuthorizationException;
use App\Exceptions\CustomException;
// use App\Exceptions\ModelNotFoundException;

class CartController extends Controller
{
    protected $cartService;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index()
    {
        try{
            $cart = $this->cartService->getCartItems($this->user());
            return $this->render('Emporium/Cart', $cart);
        }catch(Error $e){
            return back()->withErrors(['error' => 'Failed to get cart items.']);
        }
    }

    public function update(Request $request)
    {
        $id = $request->get('cart_id');
        $user = $this->user();
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        $quantity = $request->get('quantity');
        try {
            $cart = $this->cartService->get($id, $user);
            $this->cartService->changeQuantity($cart, $quantity);
            return redirect()->back()->with('success', 'Cart item updated successfully.');
        }catch(ModelNotFoundException $e){
            return back()->withErrors(['error' => $e->getMessage()]);
        }catch(CustomException $e){
            return back()->withErrors(['error' => $e->getMessage()]);
        }catch (Error $e) {
            return back()->withErrors(['error' => 'Failed to update cart item.']);
        }
    }

    public function remove(Request $request)
    {
        $id = $request->get('item');
        $user = $this->user();
        try{
            $item = $this->cartService->get($id, $user);
            $item->delete();
            return back()->with('success', 'Item removed from cart.');
        }catch (ModelNotFoundException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }catch(CustomException $e){
            return back()->withErrors(['error' => $e->getMessage()]);
        }catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to remove item from cart: ' . $e->getMessage()]);
        }
    }

    public function clear(Request $request)
    {
        $user = $this->user();
        try {
            $this->cartService->clear($user);
            return back()->with('success', 'Cart cleared successfully.');
        }catch (ModelNotFoundException $e) {
            return back()->withErrors(['error' => 'Cart is empty.']);
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to clear cart: ' . $e->getMessage()]);
        }
    }

    public function checkout(Request $request)
    {
        $user = $this->user();
        try{
            $cart = $this->cartService->checkout($user);
            return $this->render('Emporium/Checkout', $cart);
            
        }catch (ModelNotFoundException $e) {
            return back()->withErrors(['error' => 'Cart is empty.']);
        }
        catch(Exception $e){
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Failed to get cart items.']);
        }
    }
}
