package com.erp.modern_erp.dto.request;

import com.erp.modern_erp.dto.response.CourseResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssignmentRequest {

    private String title;
    private String description;
    private String dueDate;
    private Long courseId;

}
