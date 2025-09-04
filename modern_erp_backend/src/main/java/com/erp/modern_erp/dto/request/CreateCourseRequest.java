package com.erp.modern_erp.dto.request;

import lombok.Data;

@Data
public class CreateCourseRequest {
    private String code;
    private String title;
      private String semester;
    private Long lecturerId;
}
