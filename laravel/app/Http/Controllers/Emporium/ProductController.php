<?php

namespace App\Http\Controllers\Emporium;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\Access\AuthorizationException;
use App\Exceptions\CustomException;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function show(Request $request)
    {
        $id = $request->product;
        try {
            $product = $this->productService->getProductWithRelationships($id, ['store']);
            return $this->render('Emporium/Product', ['product' => $product]);
        }catch (ModelNotFoundException $e) {
            return redirect()->route('error', ['code' => 404, 'message' => $e->getMessage()]);
        } catch (Exception $e) {
            return redirect()->route('error', ['code' => $e->getCode(), 'message' => $e->getMessage()]);
        }
    }
}
