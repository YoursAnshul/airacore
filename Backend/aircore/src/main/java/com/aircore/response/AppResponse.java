package com.aircore.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppResponse<T> {
	
    private boolean success;
    private String message;
    private int statusCode;
    private T data;
    private String errorDescription;
    
    public AppResponse() {}

    public AppResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AppResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
}
