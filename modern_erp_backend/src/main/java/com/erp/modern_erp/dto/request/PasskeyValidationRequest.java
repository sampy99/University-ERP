package com.erp.modern_erp.dto.request;

import lombok.Data;

@Data
public class PasskeyValidationRequest {
    private String passkey;
    private String role;
}
