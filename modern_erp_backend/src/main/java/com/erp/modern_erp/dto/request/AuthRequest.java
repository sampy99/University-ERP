package com.erp.modern_erp.dto.request;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}