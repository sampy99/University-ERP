package com.erp.modern_erp.dto.response;

import lombok.Data;

@Data
public class LecturerResponse {

    private Long id;
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
