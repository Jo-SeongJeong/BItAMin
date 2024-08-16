package com.saessakmaeul.bitamin.exception;

import lombok.Getter;

@Getter
public class ApplicationException extends RuntimeException {
    private final ErrorCode errorCode;

    public ApplicationException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public enum ErrorCode {
        BAD_REQUEST,
        UNAUTHORIZED,
        NOT_FOUND,
        INTERNAL_SERVER_ERROR
    }

    public static class UnauthorizedException extends ApplicationException {
        public UnauthorizedException(String message) {
            super(ErrorCode.UNAUTHORIZED, message);
        }
    }
}