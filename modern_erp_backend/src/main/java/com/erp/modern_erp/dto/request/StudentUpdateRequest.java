package com.erp.modern_erp.dto.request;

import lombok.Data;

@Data
public class StudentUpdateRequest {

    private String firstName;
    private String lastName;
    private String nic;
    private String email;
    private String addressLine1;
    private String phone;
    private String addressLine2;
    private String addressLine3;
    private String studentNumber;
}
