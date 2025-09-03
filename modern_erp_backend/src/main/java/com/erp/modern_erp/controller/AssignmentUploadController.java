package com.erp.modern_erp.controller;

import com.erp.modern_erp.dto.response.AssignmentUploadResponse;
import com.erp.modern_erp.entity.Assignment;
import com.erp.modern_erp.entity.AssignmentMaterial;
import com.erp.modern_erp.entity.Result;
import com.erp.modern_erp.entity.User;
import com.erp.modern_erp.repository.AssignmentRepository;
import com.erp.modern_erp.repository.UserRepository;
import com.erp.modern_erp.service.AssignmentStorageService;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments-upload")
public class AssignmentUploadController {

   // private final AssignmentUploadService assignmentUploadService;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentStorageService storage;
    private final UserRepository userRepository;


    public AssignmentUploadController(AssignmentRepository assignmentRepository, AssignmentStorageService storage, UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.storage = storage;
        this.userRepository = userRepository;
    }


    @PostMapping(value = "/{assignmentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AssignmentMaterial> upload(
            @PathVariable Long assignmentId,
            @RequestPart("file") MultipartFile file,        // Changed from "files" to "file"
            @RequestPart("description") String description,
            @AuthenticationPrincipal User me// Changed from "titles" to "title"
    ) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));

        Optional<User> user = userRepository.findByUsername(me.getUsername());

        Long studentId = user.get().getRoleDesignationId();

        AssignmentMaterial saved = storage.store(file, description, assignment, studentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }



    @GetMapping("/get/{assignmentId}")
    public ResponseEntity<AssignmentUploadResponse> assignmentSubmissionDetails(
            @PathVariable Long assignmentId,
            @AuthenticationPrincipal User me) {

        Optional<User> user = userRepository.findByUsername(me.getUsername());
        Long studentId = user.get().getRoleDesignationId();

        AssignmentUploadResponse response = storage.assignmentSubmissionDetails(assignmentId, studentId);

        return ResponseEntity.ok(response);  // response can be null
    }



    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> download(@PathVariable String fileId) throws IOException {
        AssignmentMaterial meta = storage.getMeta(fileId);
        Resource resource = storage.loadAsResource(fileId);

        Path path = resource.getFile().toPath();
        String mimeType = Files.probeContentType(path);
        if (mimeType == null) {
            mimeType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + meta.getFileName() + "\"")
                .body(resource);
    }




    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<AssignmentMaterial>> getByAssignment(@PathVariable Long assignmentId) {
        List<AssignmentMaterial> materials = storage.getByAssignment(assignmentId);
        return ResponseEntity.ok(materials);
    }





//    @GetMapping("/student/{studentId}")
//    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByStudent(@PathVariable Long studentId) {
//        List<AssignmentResponse> assignments = assignmentUploadService.getAssignmentsByStudent(studentId);
//        return ResponseEntity.ok(assignments);
//    }
//
//
//    @GetMapping("/student/{studentId}/course/{courseId}")
//    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByStudentAndCourse(
//            @PathVariable Long studentId,
//            @PathVariable Long courseId) {
//        List<AssignmentResponse> assignments = assignmentUploadService.getAssignmentsByCourseAndStudent(courseId, studentId);
//        return ResponseEntity.ok(assignments);
//    }
}
