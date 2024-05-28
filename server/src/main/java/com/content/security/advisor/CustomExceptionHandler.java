package com.content.security.advisor;

import com.content.security.exception.ResourceNotFountException;
import com.content.security.util.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(ResourceNotFountException.class)
    public ResponseEntity<StandardResponse> handleResourceNotFoundException(ResourceNotFountException exception){
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(404,"Error",exception), HttpStatus.NOT_FOUND
        );
    }
}
