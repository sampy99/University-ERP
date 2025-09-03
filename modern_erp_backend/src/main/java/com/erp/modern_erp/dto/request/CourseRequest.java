package com.erp.modern_erp.dto.request;

import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.enums.Semester;
import lombok.Data;

@Data
public class CourseRequest {
    private String code;
    private String title;
    private String description;
    private int credits;
    private String semester;
    private Long lecturer;
}
