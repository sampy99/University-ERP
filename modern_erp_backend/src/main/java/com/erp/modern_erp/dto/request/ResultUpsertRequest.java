package com.erp.modern_erp.dto.request;

import lombok.Data;

@Data
public class ResultUpsertRequest {
    private Long studentId;
    private Long courseId;
    private String grade;
    private Double marks;
}