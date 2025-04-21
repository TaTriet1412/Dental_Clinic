package com.dental_clinic.common_lib.exception;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<String>> handlingRuntimeException(RuntimeException e) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setApiCode(ErrorCode.INTERNAL_SERVER_ERROR.getCode());
        apiResponse.setMessage(ErrorCode.INTERNAL_SERVER_ERROR.getMessage() + ": " + e.getMessage());

        return ResponseEntity
                .internalServerError()
                .body(apiResponse);
    }

    // Các exception từ validation
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String enumKey = e.getBindingResult().getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_MESSAGE_KEY;

        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setApiCode(errorCode.getCode());
        apiResponse.setMessage(enumKey);
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<?>> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        ApiResponse<?> response = new ApiResponse<>();
        response.setApiCode(ErrorCode.FAIL_FORMAT_DATA.getCode());
        response.setMessage(ErrorCode.FAIL_FORMAT_DATA.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    // Các exception đã chủ động bắt
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException e) {
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setApiCode(e.getErrorCode().getCode());
        apiResponse.setMessage(e.getDetailMessage() != null ? e.getDetailMessage() : e.getErrorCode().getMessage());

        return ResponseEntity.status(e.getErrorCode().getCode()).body(apiResponse);
    }
}
