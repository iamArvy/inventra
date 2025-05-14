<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateStoreRequest;
use Illuminate\Http\Request;

class CreateController extends Controller
{
    //
    public function index(){
        return view('store.create');
    }
    public function store(CreateStoreRequest $request){
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();
        return redirect()->route('store.index')->with('success', 'User created successfully.');
    }
}
