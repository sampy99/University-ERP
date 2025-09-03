package com.erp.modern_erp.service;

import com.erp.modern_erp.dto.request.LecturerUpdateRequest;
import com.erp.modern_erp.dto.request.StudentUpdateRequest;
import com.erp.modern_erp.dto.response.CourseResponse;
import com.erp.modern_erp.dto.response.LecturerResponse;
import com.erp.modern_erp.dto.response.StudentResponse;
import com.erp.modern_erp.dto.response.StudentResultResponse;
import com.erp.modern_erp.entity.Course;
import com.erp.modern_erp.entity.Result;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudentService {
    List<CourseResponse> dashboardCourses(Long studentId);
    void enroll(Long student, Long courseId);
    List<Result> results(Long studentId);

    StudentResponse getById(Long id);

    Page<StudentResponse> getAll(Pageable pageable, String searchText) ;

    Page<StudentResultResponse> getEnrolledStudents(Pageable pageable, Long courseId);

    StudentResponse getByStudentId(Long id);

    StudentResponse updateStudent(Long id, StudentUpdateRequest request);

}