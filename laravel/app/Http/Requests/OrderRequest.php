<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'receipient_name' => 'string | required',
            'receipient_number' => 'string | required',
            'delivery_type' => 'string | required',
            'delivery_address' => 'string | required',
            'payment_method' => 'string | required',
        ];
    }
}
