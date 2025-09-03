package com.erp.modern_erp.controller;

import com.erp.modern_erp.dto.request.EnrollRequest;
import com.erp.modern_erp.dto.request.LecturerUpdateRequest;
import com.erp.modern_erp.dto.request.StudentUpdateRequest;
import com.erp.modern_erp.dto.response.CourseResponse;
import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.entity.*;
import com.erp.modern_erp.repository.UserRepository;
import com.erp.modern_erp.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;
    private final UserRepository userRepository;


    @GetMapping("/dashboard")
    //@PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseResponse>> dashboard(@AuthenticationPrincipal User me) {
        Optional<User> user = userRepository.findByUsername(me.getUsername());

        System.out.println("----- me ----" + me.getUsername());
        Long studentId = user.get().getRoleDesignationId();

        return ResponseEntity.ok(studentService.dashboardCourses(studentId));
    }

    @PostMapping("/enroll")

    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> enroll(@AuthenticationPrincipal User me, @RequestBody EnrollRequest req) {
        System.out.printf("AuthenticationPrincipal:" + me);
        System.out.printf("AuthenticationPrincipal:" + me.getUsername());

        Optional<User> user = userRepository.findByUsername(me.getUsername());

        Long studentId = user.get().getRoleDesignationId();

        //changes done
        studentService.enroll(studentId, req.getCourseId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/results")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Result>> results(@AuthenticationPrincipal User me) {

        Optional<User> user = userRepository.findByUsername(me.getUsername());

        Long studentId = user.get().getRoleDesignationId();

        return ResponseEntity.ok(studentService.results(studentId));
    }

    @GetMapping("/profile")
    public StudentResponse getById(@AuthenticationPrincipal User me) {

        Optional<User> user = userRepository.findByUsername(me.getUsername());

        Long studentId = user.get().getRoleDesignationId();

        return studentService.getById(studentId);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Page<StudentResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchText) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<StudentResponse> students = studentService.getAll(pageable, searchText);
        System.out.println("------------" + students.getContent());

        if (students.getContent().isEmpty()) {
            return ResponseEntity.ok(null);
        }

        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getById(@PathVariable Long id) {
        StudentResponse lecturer = studentService.getByStudentId(id);
        if (lecturer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lecturer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentUpdateRequest request) {

        StudentResponse updated = studentService.updateStudent(id, request);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}