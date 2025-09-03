package com.erp.modern_erp.dto.response;

import com.erp.modern_erp.enums.Semester;
import lombok.Data;

@Data
public class CourseResponse {

    private Long id;
    private String code;
    private String title;
    private String description;
    private int credits;
    private Semester semester;
    private LecturerResponse lecturer;
}
