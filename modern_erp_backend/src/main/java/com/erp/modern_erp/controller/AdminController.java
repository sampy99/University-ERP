package com.erp.modern_erp.controller;

import com.erp.modern_erp.dto.request.AssignLecturerRequest;
import com.erp.modern_erp.dto.request.CreateCourseRequest;
import com.erp.modern_erp.dto.request.LecturerUpdateRequest;
import com.erp.modern_erp.dto.request.ResultUpsertRequest;
import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Result;
import com.erp.modern_erp.entity.Student;
import com.erp.modern_erp.entity.User;
import com.erp.modern_erp.repository.CourseRepository;
import com.erp.modern_erp.repository.ResultRepository;
import com.erp.modern_erp.repository.StudentRepository;
import com.erp.modern_erp.repository.UserRepository;
import com.erp.modern_erp.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final ResultRepository resultRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @PostMapping("/course")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@RequestBody CreateCourseRequest req) {
        return ResponseEntity.ok(adminService.createCourse(req.getCode(), req.getTitle(), req.getLecturerId()));
    }

    @PostMapping("/course/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> assignLecturer(@RequestBody AssignLecturerRequest req) {
        return ResponseEntity.ok(adminService.assignLecturer(req.getCourseId(), req.getLecturerId()));
    }

    @PostMapping("/result")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Result> upsertResult(@RequestBody ResultUpsertRequest req) {
        var student = studentRepository.findById(req.getStudentId()).orElseThrow();
        var course = courseRepository.findById(req.getCourseId()).orElseThrow();
        var existing = resultRepository.findByStudentAndCourse(student, course);
        Result r = existing.orElseGet(() -> Result.builder().student(student).course(course).build());
        r.setGrade(req.getGrade());
        r.setMarks(req.getMarks());
        return ResponseEntity.ok(resultRepository.save(r));
    }

    @PatchMapping("/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User payload) {
        return ResponseEntity.ok(adminService.updateUser(id, payload.getFullName(), payload.getEmail(), payload.getUsername()));
    }

    @GetMapping("/profile")
    public LecturerResponse getById(@AuthenticationPrincipal User me) {

        Optional<User> user = userRepository.findByUsername(me.getUsername());

        Long adminId = user.get().getRoleDesignationId();

        return adminService.getById(adminId);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Page<LecturerResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchText) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<LecturerResponse> lecturers = adminService.getAll(pageable, searchText);
        System.out.println("------------" + lecturers.getContent());

        if (lecturers.getContent().isEmpty()) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(lecturers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LecturerResponse> getById(@PathVariable Long id) {
        LecturerResponse lecturer = adminService.getByAdminId(id);
        if (lecturer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lecturer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LecturerResponse> updateAdmin(
            @PathVariable Long id,
            @RequestBody LecturerUpdateRequest request) {

        LecturerResponse updated = adminService.updateAdmin(id, request);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}