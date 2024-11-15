<?php

namespace App\Http\Controllers\Emporium;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Emporium\Category;
class CategoryController extends Controller
{
    //
    public function index()
    {
        $categories = \App\Models\Emporium\Category::all();
        return $this-render('Emporium/Products', ['categories' => $categories]);)
        return view('emporium.category.index');
    }
}
