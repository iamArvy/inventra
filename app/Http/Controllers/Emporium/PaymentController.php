<?php

namespace App\Http\Controllers\Emporium;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
class PaymentController extends Controller
{
    //

    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $paymentIntent = PaymentIntent::create([
            'amount' => $request->amount, // Amount in cents
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        return response()->json(['clientSecret' => $paymentIntent->client_secret]);
    }
}
