package com.erp.modern_erp.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class FileUploadRequest {
    private MultipartFile file;
    private String title;
}
