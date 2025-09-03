package com.erp.modern_erp.dto.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
