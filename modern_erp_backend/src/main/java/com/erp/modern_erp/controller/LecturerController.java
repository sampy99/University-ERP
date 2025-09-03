package com.erp.modern_erp.controller;

import com.erp.modern_erp.dto.request.LecturerUpdateRequest;
import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.LectureMaterial;
import com.erp.modern_erp.entity.User;
import com.erp.modern_erp.repository.UserRepository;
import com.erp.modern_erp.service.LecturerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lecturer")
@RequiredArgsConstructor
public class LecturerController {
    private final LecturerService lecturerService;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    //@PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<List<Course>> dashboard(@AuthenticationPrincipal User me) {

        Optional<User> user = userRepository.findByUsername(me.getUsername());

        Long lecturerId = user.get().getRoleDesignationId();

        return ResponseEntity.ok(lecturerService.dashboardCourses(lecturerId));
    }

    @PostMapping("/materials/upload")
    //@PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<LectureMaterial> upload(@RequestParam Long courseId,
                                                  @RequestParam String title,
                                                  @RequestParam MultipartFile file) throws IOException {
        return ResponseEntity.ok(lecturerService.uploadMaterial(courseId, title, file));
    }

    @PostMapping("/email")
    //@PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<Integer> email(@RequestParam Long courseId,
                                         @RequestParam String subject,
                                         @RequestParam String body) {
        return ResponseEntity.ok(lecturerService.emailEnrolledStudents(courseId, subject, body));
    }

    @GetMapping("/profile")
    public LecturerResponse getById(@AuthenticationPrincipal User me) {

        Optional<User> user = userRepository.findByUsername(me.getUsername());

        Long lecturerId = user.get().getRoleDesignationId();

        return lecturerService.getById(lecturerId);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Page<LecturerResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchText) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<LecturerResponse> lecturers = lecturerService.getAll(pageable, searchText);
        System.out.println("------------" + lecturers.getContent());

        if (lecturers.getContent().isEmpty()) {
            return ResponseEntity.ok(null);
        }

        return ResponseEntity.ok(lecturers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LecturerResponse> getById(@PathVariable Long id) {
        LecturerResponse lecturer = lecturerService.getByLecturerId(id);
        if (lecturer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lecturer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LecturerResponse> updateLecturer(
            @PathVariable Long id,
            @RequestBody LecturerUpdateRequest request) {

        LecturerResponse updated = lecturerService.updateLecturer(id, request);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}