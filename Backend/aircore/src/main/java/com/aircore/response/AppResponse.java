package com.aircore.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppResponse<T> {
	
    private boolean success;
    private String message;
    private int statusCode;
    private T data;
    private String errorDescription;
    
}
