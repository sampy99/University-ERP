package com.erp.modern_erp.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssignmentUploadResponse {

    private Long id;
    private String description;
    private String fileName;
    private LocalDateTime uploadedDate;
    private String filePath;
    private String fileId;
    private AssignmentResponse assignment;
    private StudentResponse student;
}
