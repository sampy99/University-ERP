package com.erp.modern_erp.dto.request;

import lombok.Data;

@Data
public class LecturerRequest {

    private String staffNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String nic;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
}
