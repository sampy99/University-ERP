package com.erp.modern_erp.controller;

import com.erp.modern_erp.dto.request.CourseRequest;
import com.erp.modern_erp.dto.request.CourseUpdateRequest;
import com.erp.modern_erp.dto.response.CourseResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.dto.response.StudentResultResponse;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.repository.CourseRepository;
import com.erp.modern_erp.service.CourseService;
import com.erp.modern_erp.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseRequest dto) {
        return ResponseEntity.ok(courseService.createCourse(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(@RequestBody CourseUpdateRequest dto) {
        return ResponseEntity.ok(courseService.updateCourse(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/unassigned")
    public ResponseEntity<Page<CourseResponse>> getUnassignedCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchText) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<CourseResponse> courses = courseService.getUnassignedCourses(pageable, searchText);

        if (courses.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/enrolled-students/{courseId}")
    public ResponseEntity<Page<StudentResultResponse>> getEnrolledStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable  Long courseId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<StudentResultResponse> students = studentService.getEnrolledStudents(pageable, courseId);

        if (students.isEmpty()) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(students);
    }
}