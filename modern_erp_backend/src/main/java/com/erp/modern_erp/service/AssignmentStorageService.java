package com.erp.modern_erp.service;

import com.erp.modern_erp.dto.response.AssignmentUploadResponse;
import com.erp.modern_erp.entity.Assignment;
import com.erp.modern_erp.entity.AssignmentMaterial;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.LectureMaterial;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface AssignmentStorageService {

    /** Store a file for a course */
     AssignmentMaterial store(MultipartFile file, String description, Assignment assignment, Long studentId);
    /** Store multiple files */
     List<AssignmentMaterial> storeAll(List<MultipartFile> files, Assignment assignment, Long studentId) ;

    /** Load file by its fileId */
     Resource loadAsResource(String fileId) ;
    /** Get metadata by fileId */
    AssignmentMaterial getMeta(String fileId) ;

     List<AssignmentMaterial> getByAssignment(Long assignmentId) ;

     AssignmentUploadResponse assignmentSubmissionDetails(Long assignmentId, Long studentId);

    }
