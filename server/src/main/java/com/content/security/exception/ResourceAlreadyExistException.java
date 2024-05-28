package com.content.security.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FOUND)
public class ResourceAlreadyExistException extends RuntimeException{

    public ResourceAlreadyExistException(String message){
        super(message);
    }
}
