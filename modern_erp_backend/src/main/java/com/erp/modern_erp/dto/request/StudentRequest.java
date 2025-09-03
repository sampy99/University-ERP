package com.erp.modern_erp.dto.request;


import lombok.Data;

@Data
public class StudentRequest {

    private String firstName;
    private String lastName;
    private String nic;
    private String email;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
    private String studentId;
}
