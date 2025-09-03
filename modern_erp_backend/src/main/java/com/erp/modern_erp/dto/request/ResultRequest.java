package com.erp.modern_erp.dto.request;

import com.erp.modern_erp.dto.response.StudentResponse;
import lombok.Data;

@Data
public class ResultRequest {
    private Double marks;
    private String grade;
    private Long student;
    private Long course;
}
