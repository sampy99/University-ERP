package com.erp.modern_erp.dto.request;

import com.erp.modern_erp.enums.Role;
import lombok.Data;

import java.util.Set;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private Set<Role> roles;
}