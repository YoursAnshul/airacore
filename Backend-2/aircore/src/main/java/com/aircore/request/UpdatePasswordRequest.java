package com.aircore.request;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private Long user_id;
    private String password;
}