package com.erp.modern_erp.dto.response;

import lombok.Data;

@Data
public class StudentResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String nic;
    private String email;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
    private String studentNumber;
}
