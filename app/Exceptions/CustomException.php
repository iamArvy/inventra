<?php

namespace App\Exceptions;

use Exception;

class CustomException extends Exception
{
    //
    protected $message;

    public function __construct($message = "A product exception has occured"){
        $this->message = $message;
        parent::__construct($this->message);
    }
}
