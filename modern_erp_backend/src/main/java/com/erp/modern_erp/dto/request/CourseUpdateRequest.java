package com.erp.modern_erp.dto.request;

import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.enums.Semester;
import lombok.Data;

@Data
public class CourseUpdateRequest {

    private Long id;
    private String code;
    private String title;
    private String description;
    private int credits;
    private Semester semester;
    private LecturerResponse lecturer;
}
