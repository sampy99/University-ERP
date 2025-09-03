package com.erp.modern_erp.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssignmentResponse {
    private Long id;

    private String title;
    private String description;
    private LocalDateTime dueDate;
    private CourseResponse course;

}
