package com.erp.modern_erp.controller;

import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.LectureMaterial;
import com.erp.modern_erp.repository.CourseRepository;
import com.erp.modern_erp.service.StorageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/lectures/materials")
public class LectureMaterialController {

    private final StorageService storage;
    private final CourseRepository courseRepo;

    public LectureMaterialController(StorageService storage, CourseRepository courseRepo) {
        this.storage = storage;
        this.courseRepo = courseRepo;
    }



    @PostMapping(value = "/{courseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LectureMaterial> upload(
            @PathVariable Long courseId,
            @RequestPart("file") MultipartFile file,        // Changed from "files" to "file"
            @RequestPart("title") String title              // Changed from "titles" to "title"
    ) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        LectureMaterial saved = storage.store(file, title, course);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> download(@PathVariable String fileId) throws IOException {
        LectureMaterial meta = storage.getMeta(fileId);
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




    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LectureMaterial>> getByCourse(@PathVariable Long courseId) {
        List<LectureMaterial> materials = storage.getByCourse(courseId);
        return ResponseEntity.ok(materials);
    }
}
