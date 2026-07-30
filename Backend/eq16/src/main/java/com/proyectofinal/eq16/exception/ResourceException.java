package com.proyectofinal.eq16.exception;

import org.springframework.http.HttpStatus;

public class ResourceException extends RuntimeException {
    private final HttpStatus status;

    public ResourceException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public ResourceException(String message) {
        this(message, HttpStatus.NOT_FOUND);
    }

    public HttpStatus getStatus() {
        return status;
    }
}
