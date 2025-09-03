package com.erp.modern_erp.dto.request;

import lombok.Data;

@Data
public class SignupRequest {

    private String email;

    private String firstName;

    private String lastName;
    private String nic;

    private String phone;

    private String addressLine1;
    private String addressLine2;

    private String addressLine3;
private String staffNumber;
    private String studentNumber;
    private String username;
    private String password;
    private String role; // USER, LECTURER, ADMIN


}