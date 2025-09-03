package com.erp.modern_erp.dto.request;

import lombok.Data;


@Data
public class AssignmentUploadRequest {

    private String description;
    private Long assignment;
    private Long student;
}
