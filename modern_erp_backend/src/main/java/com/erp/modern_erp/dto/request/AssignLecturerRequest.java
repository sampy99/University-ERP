package com.erp.modern_erp.dto.request;

import lombok.Data;

@Data
public class AssignLecturerRequest {
    private Long courseId;
    private Long lecturerId;
}