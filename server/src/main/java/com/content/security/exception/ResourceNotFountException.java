package com.content.security.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFountException extends RuntimeException{

    public ResourceNotFountException(String message){
        super(message);
    }
}
