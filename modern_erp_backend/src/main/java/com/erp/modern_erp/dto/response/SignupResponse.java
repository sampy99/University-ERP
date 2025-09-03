package com.erp.modern_erp.dto.response;

import com.erp.modern_erp.enums.Role;
import lombok.Data;

@Data
public class SignupResponse {
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
    private Role role; // USER, LECTURER, ADMIN


}
